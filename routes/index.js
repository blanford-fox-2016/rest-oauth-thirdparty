'use strict'
// ---------------------------------------------------------------------
// ROUTING
// ---------------------------------------------------------------------
const express = require('express')

// Initiate Express
const app = express()
const routesIndex = express.Router()

// controllers
const controller = require('../controllers/indexController')

routesIndex.get('/', controller.viewIndex);

module.exports = routesIndex
