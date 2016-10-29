'use strict'

let viewLogin = (req, res, next) => {
  res.render('login')
}

let processLogin = (req, res, next) => {
  res.redirect('/dashboard')
}

module.exports = {
  viewLogin: viewLogin,
  processLogin: processLogin
}
