'use strict'

let viewLogin = (req, res, next) => {
  res.render('login')
}

let processLogin = (req, res, next) => {
  res.render('profile')
}


module.exports = {
  viewLogin: viewLogin,
  processLogin: processLogin
}
