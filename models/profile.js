var mongoose = require('mongoose')

var profileSchema = new mongoose.Schema({
    name: String,
    password: String,
    username: String,
    email: String
})

var Profile = mongoose.model('profile', profileSchema)

module.exports = Profile