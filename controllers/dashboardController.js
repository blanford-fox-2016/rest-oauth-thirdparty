'use strict'
let Model = require('../models/user')

let viewDashboard = (req, res, next) => {
  console.log(req.user);
  res.render('profile', { userFacebook: req.user });
  // require('connect-ensure-login').ensureLoggedIn(),
  //   function(req, res){
  //     res.render('profile', { user: req.user });
  //   }
}

module.exports = {
  viewDashboard: viewDashboard
}
