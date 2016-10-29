'use strict'
// ---------------------------------------------------------------------
// ROUTING
// ---------------------------------------------------------------------
const express = require('express')

// Initiate Express
const app = express()
const routesSignup = express.Router()

// controllers
let controller = require('../controllers/userController')

// middleware
const middleware = require('../helper/middleware')

// show sign up form
routesSignup.get('/', middleware.checkSignup, controller.formSignUp)

// process sign up / insert data into database
routesSignup.post('/add', controller.processSignUp)

module.exports = routesSignup
