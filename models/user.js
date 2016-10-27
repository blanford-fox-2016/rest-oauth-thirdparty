'use strict'

var mongoose = require('mongoose');
var passportLocalMongoose = require('passport-local-mongoose');

// define an Actor model with this mongoose instance
var userSchema = mongoose.Schema({
  username: String,
  password: String,
  email: String,
  image: String
 });

userSchema.plugin(passportLocalMongoose)

module.exports = mongoose.model('user', userSchema);
