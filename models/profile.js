var mongoose = require('mongoose')

var passportLocalMongoose = require('passport-local-mongoose')

var profileSchema = new mongoose.Schema({
    name: String,
    password: String,
    username: String,
    email: String
})

profileSchema.plugin(passportLocalMongoose)

var Profile = mongoose.model('profile', profileSchema)

module.exports = Profile