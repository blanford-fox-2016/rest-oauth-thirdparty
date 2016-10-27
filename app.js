const express = require('express')
const path = require('path')
const favicon = require('serve-favicon')
const logger = require('morgan')
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser')
const methodOverride = require('method-override')

const mongoose = require('mongoose')
const session = require('express-session')
const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const FacebookStrategy = require('passport-facebook').Strategy
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy

const routes = require('./routes/index')
const api = require('./routes/api')

const user = require('./models/user')

const app = express()
const config = require('./config/config.js')

// view engine setup
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'jade')

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')))
app.use(logger('dev'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')))
app.use(methodOverride(function (req, res) {
  if (req.body && typeof req.body === 'object' && '_method' in req.body) {
    // look in urlencoded POST bodies and delete it
    let method = req.body._method
    delete req.body._method
    return method
  }
}))

// -----------------------------------------------------------------------------
// ROUTE AND PASSPORT CONFIGURATION
// -----------------------------------------------------------------------------

app.use(session({
  secret: 'secret',
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 60000
  }
}))

app.use(passport.initialize())
app.use(passport.session())

app.use('/', routes)
app.use('/api', api)

passport.use(new LocalStrategy(user.authenticate()))

// FACEBOOK
passport.use(new FacebookStrategy({
    clientID: config.facebookAuth.facebook_api_key,
    clientSecret: config.facebookAuth.facebook_api_secret,
    callbackURL: 'http://localhost:3000/auth/facebook/callback'
  },
  function (accessToken, tokenSecret, profile, cb) {
    console.log("FACEBOOK:", profile)
    user.create({
      username: profile.displayName.toLowerCase().trim()
    })
    return cb(null, profile)
  }))

// GOOGLE
passport.use(new GoogleStrategy({
  clientID: config.googleAuth.web.client_id,
  clientSecret: config.googleAuth.web.client_secret,
  callbackURL: 'http://localhost:3000/auth/google/callback'
}, function (req, accessToken, refreshToken, profile, done) {
  console.log("GOOGLE:", profile)
  user.create({
    email: profile.emails[0].value
  }, {
    username: profile.displayName.toLowerCase().trim(),
    email: profile.emails[0].value
  }, {
    upsert: true
  })
  done
}))

// MONGODB AND MONGOOSE
mongoose.Promise = global.Promise
mongoose.connect('mongodb://localhost:27017/passport')

// BIND PASSPORT WITH USER MODEL (PASSPORT-LOCAL-MONGOOSE)
passport.serializeUser(user.serializeUser())
passport.deserializeUser(user.deserializeUser())

// -----------------------------------------------------------------------------
// MISC CONFIGURATION
// -----------------------------------------------------------------------------

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  var err = new Error('Not Found')
  err.status = 404
  next(err)
})

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function (err, req, res, next) {
    res.status(err.status || 500)
    res.render('error', {
      message: err.message,
      error: err
    })
    m
  })
}

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
  res.status(err.status || 500)
  res.render('error', {
    message: err.message,
    error: {}
  })
})

module.exports = app
