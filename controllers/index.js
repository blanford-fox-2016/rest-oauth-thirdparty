var passport = require('passport')
var Profile = require('../models/profile')


function viewHome (req, res) {
    res.render('index', {title: "Home", profile:req.user})
}

function viewLogin (req, res) {
    res.render('login', {title: "Home"})
}

function viewRegister (req, res) {
    res.render('register', {title: "Home"})
}

function localLogin (req, res) {
    res.redirect('/profile')
}

function localRegister (req, res, next) {
    Profile.register(new Profile({
        name: req.body.name,
        username: req.body.username,
        email: req.body.email
    }), req.body.password, function (err) {
        if (err) {
            return res.render('index', {title: "Home"})
        }

        console.log('user registered!');
        passport.authenticate('local')(req, res, function () {
            req.session.save(function (err) {
                if (err) {
                    return next(err)
                }
                res.redirect('/profile')
            })
        })
    })
}

function isAuthenticate (req, res, next) {
    if (req.isAuthenticated())
        return next();

    res.redirect('/');
}

function isLogin (req, res, next) {
    if (req.isAuthenticated())
        res.redirect('/profile');

    return next();
}

function getProfile (req, res) {
    res.render('profile', {profile:req.user})

}

function logout (req, res) {
    req.session.destroy()
    res.redirect('/')
}

module.exports = {
    viewHome: viewHome,
    viewLogin: viewLogin,
    viewRegister: viewRegister,
    localRegister: localRegister,
    getProfile: getProfile,
    localLogin: localLogin,
    isAuthenticate: isAuthenticate,
    isLogin: isLogin,
    logout: logout
}