'use strict'

// require express
const express = require('express');
const bodyParser = require('body-parser');
const logger = require('morgan');
const session = require('express-session');
var path = require('path');

// instance the express via app
let app = express();

//config
const config = require('./config/config.json')

// Auth
const passport = require('passport');
const LocalStrategy   = require('passport-local').Strategy;
const facebook = require('passport-facebook').Strategy;
const twitter = require('passport-twitter').Strategy;

// require mongoose
const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/oauth');
let User = require('./models/user'); // model from schema

// -----------------------------------------------------------
// routes
// -----------------------------------------------------------
const auth = require('./routes/auth');
const routesIndex = require('./routes/index');
const routesAuth= require('./routes/auth');
const routesSignup = require('./routes/signup');
const routesLogin = require('./routes/login');
const routesLogout = require('./routes/logout');
const routesDashboard = require('./routes/dashboard');

// set the port
let port = process.env.PORT || 3000;

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(session({
  secret : 'whatever',
  resave : false,
  saveUninitialized : false,
  cookie : {
    maxAge : 10000000
  }
}))

app.use(passport.initialize())
app.use(passport.session())


// -----------------------------------------------------
// facebook confifguration
// -----------------------------------------------------

passport.use(new LocalStrategy(User.authenticate()));

/*
passport.use(new FacebookStrategy({
    clientID: process.env.FACEBOOK_APP_ID,
    clientSecret: process.env.FACEBOOK_APP_SECRET,
    callbackURL: process.env.FACEBOOK_CALLBACK,
    profileFields: ['id', 'displayName', 'photos', 'email'],
    passReqToCallback: true
  }, function (req, accessToken, refreshToken, profile, done)
*/

passport.use(new facebook({
  clientID: config.facebook.clientID,
  clientSecret: config.facebook.clientSecret,
  callbackURL: config.facebook.callbackURL,
  profileFields: ['id', 'displayName', 'photos', 'email'],
  passReqToCallback: true
},
function(req, accessToken, refreshToken, profile, done) {
  // console.log(profile);
  User.create({
    name: profile.displayName
  })

  return done(null, profile);
}));

passport.serializeUser(function(user, cb) {
  cb(null, user);
});

passport.deserializeUser(function(obj, cb) {
  cb(null, obj);
});

// -----------------------------------------------------
// twitter confifguration
// -----------------------------------------------------

passport.use(new twitter({
  consumerKey: config.twitter.consumerKey,
  consumerSecret: config.twitter.consumerSecret,
  callbackURL: config.twitter.callbackURL
},
function(accessToken, refreshToken, profile, cb) {
  return cb(null, profile);
}));

passport.serializeUser(function(user, cb) {
  cb(null, user);
});

passport.deserializeUser(function(obj, cb) {
  cb(null, obj);
});

// -----------------------------------------------------
// routes config
// -----------------------------------------------------
app.use(logger('dev'));
app.use('/', routesIndex)
app.use('/signup', routesSignup)
app.use('/auth', routesAuth)
app.use('/login', routesLogin)
app.use('/logout', routesLogout)
app.use('/dashboard', routesDashboard)

app.listen(port, () => {
  console.log('the server is running on port ', port);
})
