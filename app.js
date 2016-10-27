var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var session = require('express-session')
var bodyParser = require('body-parser');

var Profile = require('./models/profile')

var mongoose = require('mongoose');
mongoose.Promise = global.Promise
mongoose.connect('mongodb://localhost/dharmadi')

var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var TwitterStrategy = require('passport-twitter').Strategy
var FacebookStrategy = require('passport-facebook').Strategy
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy


var routes = require('./routes/index');
var users = require('./routes/users');
var auth = require('./routes/oauth');

var config = require('./config/config')

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(session({
  secret: 'abcdefgh',
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 6000000
  }
}))
app.use(express.static(path.join(__dirname, 'public')));

// bind model.auth to passport-local
passport.use(new LocalStrategy(Profile.authenticate()))


passport.use(new GoogleStrategy({
    clientID: config.googleAuth.clientId,
    clientSecret: config.googleAuth.clientSecret,
    callbackURL: config.googleAuth.callBackURL
  },
  function (accessToken, refreshToken, profile, done) {
    Profile.findOneAndUpdate({
      username: profile.username
    }, {
      name: profile.displayName,
      username: profile.username,
      email: profile.emails[0].value
    }, {
      upsert: true
    }, function (err, user) {
      if (err) {
        return done(err);
      }
      done(null, user);
    })
  }
))

passport.use(new FacebookStrategy({
    clientID: config.facebookAuth.appId,
    clientSecret: config.facebookAuth.appSecret,
    callbackURL: config.facebookAuth.callBackURL,
    profileFields: ['id', 'displayName', 'photos', 'email'],
    passReqToCallback: true
  },
  function (req, accessToken, refreshToken, profile, done) {
    console.log(profile)
    Profile.findOneAndUpdate({
      email: profile.emails[0].value
    }, {
      name: profile.displayName,
      username: profile.displayName.toLowerCase().replace(/\s+/g, ''),
      email: profile.emails[0].value
    }, {
      upsert: true
    }, function (err, user) {
      if (err) {
        return done(err);
      }
      done(null, user);
    })
  }
))

passport.use(new TwitterStrategy({
    consumerKey: config.twitterAuth.consumerKey,
    consumerSecret: config.twitterAuth.consumerSecret,
    callbackURL: config.twitterAuth.callBackURL
  },
  function (token, tokenSecret, profile, done) {
    Profile.findOneAndUpdate({
      username: profile.username
    }, {
      name: profile.displayName,
      username: profile.username,
      email: profile.username + '@twitter.com'
    }, {
      upsert: true
    }, function (err, user) {
      if (err) {
        return done(err);
      }
      done(null, user);
    })
  }
))

app.use(passport.initialize());
app.use(passport.session());

app.use('/', routes);
app.use('/users', users);
app.use('/auth', auth);

passport.serializeUser(Profile.serializeUser())
passport.deserializeUser(Profile.deserializeUser())

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
