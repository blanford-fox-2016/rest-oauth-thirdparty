'use strict'
// ---------------------------------------------------------------------
// ROUTING
// ---------------------------------------------------------------------
const express = require('express')

// passport
const passport = require('passport');

const routesLogout = express.Router()

// controllers
const controller = require('../controllers/logoutController')

routesLogout.get('/', controller.processLogout);

module.exports = routesLogout
