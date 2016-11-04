'use strict'
let Model = require('../models/user')
// model from schema
let User = require('../models/user');

let viewDashboard = (req, res, next) => {
  console.log(req.user);
  if(req.user.provider === 'local'){
    //local
    User.findOne({
      username : req.user.username
    }, (err, user) => {
      console.log('ini data user dari local : ' + user);
      if(err){
        console.log(err);
      }else {
        res.render('profile', { user: user });
      }
    })
  }else{
    //socmed
    User.findOne({
      name : req.user.displayName
    }, (err, user) => {
      console.log('ini data user dari sosmed : ' + user);
      if(err){
        console.log(err);
      }else {
        res.render('profile', { user: user });
      }
    })
  }
}

module.exports = {
  viewDashboard: viewDashboard
}
