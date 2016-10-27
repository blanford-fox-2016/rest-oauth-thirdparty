'use strict'
let mongoose = require('mongoose');
let passportLocalMongoose = require('passport-local-mongoose');

let usersSchema = new mongoose.Schema({
  name: String,
  email: String,
  username: String,
  photo: String
});

usersSchema.plugin(passportLocalMongoose)
let users = mongoose.model('users', usersSchema);

module.exports = users;
