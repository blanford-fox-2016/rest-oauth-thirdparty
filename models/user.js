const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');

let Schema = mongoose.Schema;

let User = new Schema({
  name        : String,
  username    : String,
  password    : {
    type      : String,
    lowercase : true,
    trim      : true
  },
  photo       : {
    type      : String,
    trim      : true
  }
});

User.plugin(passportLocalMongoose)
module.exports = mongoose.model('User', User);
