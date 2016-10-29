'use strict'
// ---------------------------------------------------------------------
// ROUTING
// ---------------------------------------------------------------------
const express = require('express')

// passport
const passport = require('passport');

// Initiate Express
const app = express()
const routesLogin = express.Router()

// controllers
const controller = require('../controllers/loginController')

// middleware
const middleware = require('../helper/middleware')

routesLogin.get('/', middleware.checkLogin, controller.viewLogin);

// routesLogin.post('/login', passport.authenticate('local', {failureRedirect: '/login'}), controller.processLogin)

routesLogin.post('/', passport.authenticate('local'), controller.processLogin)

module.exports = routesLogin
