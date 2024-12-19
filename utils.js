const getUserByEmail = (arr, email) => {
    return arr.find(user => user.email === email)
}

const getUserByLogin = (arr, username) => {
    return arr.find(user => user.username === username)
}

const getUserById = (arr, id) => {
    return arr.find(user => user.id === id)
}

const getProductById = (arr, id) => {
    return arr.find(product => product.productId === id)
}


module.exports = {getUserByEmail, getUserByLogin, getUserById, getProductById}