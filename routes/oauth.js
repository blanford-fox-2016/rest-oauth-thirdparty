var express = require('express');
var router = express.Router();
var passport = require('passport')


//twitter
router.get('/twitter',
  passport.authenticate('twitter')
)

router.get('/twitter/callback',
  passport.authenticate('twitter', {
    successRedirect: '/profile',
    failureRedirect: '/',
    failureFlash: true
  })
)

//facebook
router.get('/facebook',
  passport.authenticate('facebook', {
    scope: ['email']
  }))

router.get('/facebook/callback',
  passport.authenticate('facebook', {
    successRedirect: '/profile',
    failureRedirect: '/',
    failureFlash: true
  })
)

//google

router.get('/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
)

router.get('/google/callback',
  passport.authenticate('google', {
    successRedirect: '/home',
    failureRedirect: '/',
    failureFlash: true
  })
)

module.exports = router
