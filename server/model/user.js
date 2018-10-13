const mongoose = require('mongoose')

const User = mongoose.model('User', {
    userName: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    token: {
        
    }
})

module.exports = {
    User
}