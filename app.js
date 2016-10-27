var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var mongoose = require('mongoose')                                        // TODO: Required for passport authentication
var session = require('express-session')                                  // TODO: Required for passport authentication
const passport = require('passport')                                      // TODO: Required for passport authentication
const LocalStrategy = require('passport-local').Strategy                  // TODO: Required for passport authentication
const FacebookStrategy  = require('passport-facebook').Strategy
const GoogleStrategy = require('passport-google-oauth').Strategy

var routes = require('./routes/index');
var users = require('./routes/users');
var api = require('./routes/api')
var methodOverride = require('method-override')
var user = require('./models/user')
var app = express();
var config = require('./config/config.js')

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(methodOverride(function(req, res){
  if (req.body && typeof req.body === 'object' && '_method' in req.body) {
    // look in urlencoded POST bodies and delete it
    var method = req.body._method
    delete req.body._method
    return method
  }
}))
app.use(session({                                                         // TODO: Required for passport authentication
  secret: 'secret',
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 60000
  }
}))

app.use(passport.initialize())                                            // TODO: Required for passport authentication
app.use(passport.session())                                               // TODO: Required for passport authentication


app.use('/', routes);
// app.use('/users', users);
app.use('/api', api)

passport.use(new LocalStrategy(user.authenticate()))                      // TODO: Required for passport authentication
passport.use(new FacebookStrategy({
    clientID: config.facebookAuth.facebook_api_key,
    clientSecret: config.facebookAuth.facebook_api_secret,
    callbackURL: 'http://localhost:3000/auth/facebook/callback'
  },
  function(accessToken, tokenSecret, profile, cb) {
    console.log(profile);
    user.create({
      username: profile.displayName
    })
    return cb(null, profile);
  }));
passport.use(new GoogleStrategy({
  consumerKey: config.googleAuth.web.client_id,
  consumerSecret: config.googleAuth.web.client_secret,
  callbackURL: config.googleAuth.web.redirect_uris
}))


mongoose.Promise = global.Promise                                         // TODO: Required for passport authentication
mongoose.connect('mongodb://localhost:27017/passport')

passport.serializeUser(user.serializeUser())                              // TODO: Required for passport authentication
passport.deserializeUser(user.deserializeUser())                          // TODO: Required for passport authentication

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });m
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
