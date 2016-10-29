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

routesAuth.get('/twitter', passport.authenticate('twitter'));

routesAuth.get('/google',
  passport.authenticate('google', {
    scope: ['profile', 'email']
  }))


routesAuth.get('/facebook/callback',
  passport.authenticate('facebook', {
    successRedirect: '/dashboard',
    failureRedirect: '/login'
  })
);

routesAuth.get('/twitter/callback',
  passport.authenticate('twitter', { failureRedirect: '/login' }),
  controller.processLogin);

routesAuth.get('/google/callback',
  passport.authenticate('google', {
    successRedirect: '/dashboard',
    failureRedirect: '/login',
    failureFlash: true
  })
)

module.exports = routesAuth
