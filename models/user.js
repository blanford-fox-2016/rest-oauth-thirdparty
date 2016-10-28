'use strict'
// load the things we need
var mongoose = require('mongoose');
var bcrypt   = require('bcrypt-nodejs');

// define the schema for our user model
var userSchema = mongoose.Schema({
//local model
    local            : {
        email        : String,
        password     : String
    },
//facebookAuth model
    facebook         : {
        id           : String,
        token        : String,
        email        : String,
        name         : String
    },
//twitterAuth model
    twitter          : {
        id           : String,
        token        : String,
        displayName  : String,
        username     : String
    },
//googleAuth model
//googleAuth
    google           : {
        id           : String,
        token        : String,
        email        : String,
        name         : String
    }

});

// generating a hash
userSchema.methods.generateHash = (password) => {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(6), null);
};

// password validator
userSchema.methods.validPassword = (password) => {
    return bcrypt.compareSync(password, this.local.password);
};

module.exports = mongoose.model('User', userSchema);
