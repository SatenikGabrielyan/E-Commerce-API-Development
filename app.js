const express = require("express")
const {getUserByEmail, getUserByLogin, getUserById, getProductById} = require("./utils.js")
const PORT = 3000

const app = express()
app.use(express.json())

let users = []
let products = []
let orders = []

app.post("/users/register", (req, res) => {
    const {username, email, password, isAdmin = false} = req.body

    if(!username || username.length < 3){
        res.status(400).json({error: "Username must be at least 3 characters"})
    }
    if(!password || password.length < 6) {
        res.status(400).json({error: "Password must be at least 6 characters"})
    }
    if(!email || getUserByEmail(users, email)){
        res.status(400).json({error: "Email already taken"})
    }
    const newUser = {id:users.length + 1, username, email, password, isAdmin}
    users.push(newUser)
    res.status(201).json({message: "User registered successfully", 
                          user:{username:newUser.username, email:newUser.email, isAdmin:newUser.isAdmin}})
 
})

app.post("/users/login", (req, res) => {
    const {username, password} = req.body
    const founded = getUserByLogin(users, username)
    if(!founded || founded.password !== password) {
        res.status(400).json({message: "Invalid username or password"})
    }
   res.status(200).json({message: "Successfully logged in", 
                         user:{username:founded.username, email:founded.email, isAdmin:founded.isAdmin}})
})

app.post("/products", (req, res) => {
    const {name, description, price, category, imageUrl, isActive = true} = req.body
    if(!name || name.length < 1) {
        res.status(400).json({error: "Product name is required"})
    }
    if(!price || price < 0) {
        res.status(400).json({error: "Price must be greater then 0"})
    }
    const product = {productId: products.length + 1, name, description, price, category, imageUrl, isActive}
    products.push(product)
    res.status(201).json({message: "The product has been added successfully",
        product: {name: product.name, description: product.description, price: product.price, 
                  imageUrl: product.imageUrl, isActive: product.isActive}
    })
})

app.get("/products", (req, res) => {
    res.status(200).json({message:products})
})

app.post("/orders", (req, res) => {
    const {userId, orderedProducts, totalPrice, STATUS = "PENDING"} = req.body
    const user = getUserById(users, userId)
    if(!user) {
        res.status(400).json({message: "The user does not exist"})
    }
    for(let p of orderedProducts){
        if(!getProductById(products, p.productId)){
            res.status(400).json({message: "The product is required"})
        }
        if(!p.quantity || p.quantity <= 0) {
           res.status(400).json({message: "Invalid quantity"})
        }
        const found = getProductById(products, p.productId)
        if(found.isActive === false){
            res.status(400).json({message: "The product isn't available for order"})
        }
    }

    if(!Array.isArray(orderedProducts) || orderedProducts.length === 0 ) {
        res.status(400).json({message: "Products are required"})
    }
    if(totalPrice < 0) {
        res.status(400).json({message: "Total price must be greater then 0"})
    }
    const order = {orderId: orders.length + 1, userId, orderedProducts, totalPrice, STATUS}
    orders.push(order)
    res.status(201).json({message: "Order successfully created", 
        order:{userId:order.userId, orderedProducts:order.orderedProducts,totalPrice:order.totalPrice, STATUS: order.STATUS }})
    
})

app.get("/orders", (req, res) => {
    res.status(200).json(orders)
})

app.listen(PORT, () => {
    console.log(`Server is running on ${PORT}`)
})