'use strict'

let viewLogin = (req, res, next) => {
  res.render('login')
}

let processLogin = (req, res, next) => {
  res.render('profile')
}


// app.get('/profile',
//   require('connect-ensure-login').ensureLoggedIn(),
//   function(req, res){
//     res.render('profile', { user: req.user });
//   });

module.exports = {
  viewLogin: viewLogin,
  processLogin: processLogin
}
