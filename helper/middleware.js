'use strict'

let checkAuth = (req, res, next) => {
  if(req.isAuthenticated()){
    return next()
  }else{
    res.redirect('/')
  }
}

let checkLogin = (req, res, next) => {
  if(req.isAuthenticated()){
    res.redirect('/dashboard')
  }else{
    return next()
  }
}

let checkSignup = (req, res, next) => {
  if(req.isAuthenticated()){
    res.redirect('/dashboard')
  }else{
    return next()
  }
}

module.exports = {
  checkAuth: checkAuth,
  checkLogin: checkLogin,
  checkSignup: checkSignup
}
