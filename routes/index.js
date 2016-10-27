var express = require('express');
var router = express.Router();
const passport = require('passport')
var controller = require('../controller/controller.js')

/* GET home page. */
router.get('/', controller.index)

router.get('/home', controller.home);

router.get('/register', controller.registerPage);

router.post('/register', controller.registerSchema)

router.get('/list', controller.listPage)

router.get('/update/:id', controller.getUpdate)

router.put('/update/:id', controller.putUpdate)

router.delete('/delete/:id', controller.deleteUser)

router.get('/login', controller.loginPage)

router.post('/login', passport.authenticate('local'), controller.authentication)

router.get('/logout', controller.logout)

// router.get('/auth/facebook', passport.authenticate('facebook'))

router.get('/auth/facebook/callback', function (req, res, next) {
  res.send('facebook success')
})

router.get('/auth/google/callback', function (req, res, next) {
  res.send('google success')
})


router.get('/auth/facebook',passport.authenticate('facebook', {successRedirect : '/home',failureRedirect: '/login'}),
  function(req, res) {
    console.log('succes');
  });

router.get('/auth/google',passport.authenticate('google', {successRedirect : '/home',failureRedirect: '/login'}),
  function(req, res) {
    console.log('succes');
  });




module.exports = router;
