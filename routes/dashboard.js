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

routesDashboard.get('/', controller.viewDashboard)


module.exports = routesDashboard
