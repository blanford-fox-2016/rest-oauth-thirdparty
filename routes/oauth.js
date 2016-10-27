var express = require('express');
var router = express.Router();
var passport = require('passport')


//twitter
router.get('/twitter',
    passport.authenticate('twitter')
)

router.get('/twitter/callback',
    passport.authenticate('twitter', {
        successRedirect: '/home',
        failureRedirect: '/',
        failureFlash: true
    })
)

//facebook
router.get('/facebook',
    passport.authenticate('facebook')
)

router.get('/facebook/callback',
    passport.authenticate('facebook', {
        successRedirect: '/home',
        failureRedirect: '/',
        failureFlash: true
    })
)

//google

router.get('/google',
    passport.authenticate('google', {scope: ['profile', 'email']})
)

router.get('/google/callback',
    passport.authenticate('google', {
        successRedirect: '/home',
        failureRedirect: '/',
        failureFlash: true
    })
)

module.exports = router