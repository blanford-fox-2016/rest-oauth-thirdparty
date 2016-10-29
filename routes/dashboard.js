'use strict'
// ---------------------------------------------------------------------
// ROUTING
// ---------------------------------------------------------------------
const express = require('express')

// passport
const passport = require('passport');

// Initiate Express
const app = express()
const routesDashboard = express.Router()

// controllers
const controller = require('../controllers/dashboardController')

// middleware
const middleware = require('../helper/middleware')

// routesDashboard.get('/', require('connect-ensure-login').ensureLoggedIn(), controller.viewDashboard)

routesDashboard.get('/', middleware.checkAuth, controller.viewDashboard)


module.exports = routesDashboard
