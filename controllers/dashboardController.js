'use strict'
let Model = require('../models/user')

let viewDashboard = (req, res, next) => {
  res.render('profile')
}


module.exports = {
  viewDashboard: viewDashboard
}
