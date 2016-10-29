'use strict'
// ---------------------------------------------------------------------
// ROUTING
// ---------------------------------------------------------------------
const express = require('express')

// passport
const passport = require('passport');

const routesAuth = express.Router()

// controllers
const controller = require('../controllers/authController')

routesAuth.get('/facebook',
  passport.authenticate('facebook', {
    scope: ['email']
  }))

routesAuth.get('/facebook/callback',
  passport.authenticate('facebook', {
    successRedirect: '/dashboard',
    failureRedirect: '/login'
  })
);


module.exports = routesAuth
