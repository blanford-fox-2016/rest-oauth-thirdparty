'use strict'
// ---------------------------------------------------------------------
// ROUTING
// ---------------------------------------------------------------------
const express = require('express')

// passport
const passport = require('passport');

const routesAuth = express.Router()

// controllers
const controller = require('../controllers/loginController')

routesAuth.get('/facebook/callback',
  passport.authenticate('facebook', {
    successRedirect: '/dashboard',
    failureRedirect: '/login'
  })
);


module.exports = routesAuth
