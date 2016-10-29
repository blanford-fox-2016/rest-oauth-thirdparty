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

routesLogin.get('/', controller.viewLogin);

routesLogin.get('/facebook', passport.authenticate('facebook'));

routesLogin.get('/twitter', passport.authenticate('twitter'));

// routesLogin.post('/login', passport.authenticate('local', {failureRedirect: '/login'}), controller.processLogin)

routesLogin.post('/', controller.processLogin)

module.exports = routesLogin
