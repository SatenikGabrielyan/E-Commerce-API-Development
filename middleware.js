const {getUserByEmail} = require("./utils")

const userValidator = (arr) => {
    return function(req, res, next){
        const {username, email, password, isAdmin } = req.body

        if(!username || username.length < 3){
            return res.status(400).json({error: "Username must be at least 3 characters"})
        }
        if(!password || password.length < 6) {
            return res.status(400).json({error: "Password must be at least 6 characters"})
        }
        if(!email || getUserByEmail(arr, email)){
            return res.status(400).json({error: "Email already taken"})
        }
        req.body = {username, email, password, isAdmin}
        next()
    }
}

const authenticateUser = (req, res, next) => {
    const user = {
        username: "admin",
        email: "admin@gmail.com",
        password: "admin123",
        isAdmin: true
    }
    req.body.user = user
    next()
}

const authorizedUser = (req, res, next) => {
    const user = req.body.user
    if(user.isAdmin) {
        next()
    }
    return res.status(400).json({error: "Access denied"})
     
}

const normalizeInput = (req, res, next) => {
    if(req.method === "POST" || req.method === "PUT"){
        for(const key in req.body){
            if(typeof req.body[key] === "string"){
                req.body[key] = req.body[key].trim().toLowerCase()
            }
        }
    }
    next()
}

const validateUserId = (req, res, next) => {
    const userId = req.body.userId
    if(!userId) {
        return res.status(400).json({message: "User id is required"})
    }
    next()
}

const checkUserExists = (arr) => {
    return function(req, res, next){
        const userId = req.body.userId
        const found = arr.find(user => user.userId === userId)
        if(!found) {
            return res.status(404).json({message: "User not found"})
        }
        next()
    }
}

module.exports = {authenticateUser, authorizedUser, normalizeInput, userValidator, validateUserId, checkUserExists}