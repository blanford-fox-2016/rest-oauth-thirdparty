var express = require('express');
var router = express.Router();
var controller = require('../controllers')
var passport = require('passport')

/* GET home page. */
router.get('/', controller.viewHome);
router.get('/register', controller.viewRegister);

router.post('/register', controller.localRegister)

router.get('/login', controller.isLogin, controller.viewLogin);
router.post('/login', passport.authenticate('local'), controller.localLogin)

// router.get('/profile', controller.isAuthenticated, controller.getProfile)
router.get('/profile', controller.isAuthenticate, controller.getProfile)

module.exports = router;
