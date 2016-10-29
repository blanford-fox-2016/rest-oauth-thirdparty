'use strict'

let processLogout = (req, res, next) => {
  req.logout()
  res.redirect('/login')
}

module.exports = {
  processLogout: processLogout
}
