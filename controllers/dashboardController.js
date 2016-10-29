'use strict'
let Model = require('../models/user')
// model from schema
let User = require('../models/user');

let viewDashboard = (req, res, next) => {
  User.findOne({
    name : req.user.displayName,
    provider: req.user.provider
  }, (err, user) => {
    console.log('ini data user : ' + user);
    if(err){
      console.log(err);
    }else {
      res.render('profile', { user: user });
    }
  })
}

module.exports = {
  viewDashboard: viewDashboard
}
