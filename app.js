'use strict'

// require express
const express = require('express');
const bodyParser = require('body-parser');
const logger = require('morgan');
const session = require('express-session');
var path = require('path');

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

// routes
const auth = require('./routes/auth');
const routes = require('./routes/index');
// const providers = require('./helpers/providers');
let controller = require('./controllers/userController')


// set the port
let port = process.env.PORT || 3000;

passport.use(new LocalStrategy(User.authenticate()));

passport.use(new facebook({
    clientID: "259582084439610",
    clientSecret: "414d2bbc0df52ba0c52846223c6ede46",
    callbackURL: 'http://localhost:3000/auth/facebook/callback'
  },
  function(accessToken, refreshToken, profile, cb) {
    console.log(profile);
    User.create({
      name: profile.displayName
    })

    return cb(null, profile);
  }));


// instance the express via app
let app = express();

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


// passport.use(new LocalStrategy(User.authenticate()));


passport.serializeUser(function(user, cb) {
  cb(null, user);
});

passport.deserializeUser(function(obj, cb) {
  cb(null, obj);
});


passport.use(new twitter({
    consumerKey: "R2dWdhEjaUxtZq0znY52G1Hcb",
    consumerSecret: "rbbPZ1G6R61JotvOwlW86QI8E5LwU2RHRJsRDh9lvOF3al8BTj",
    callbackURL: 'http://localhost:3000/auth/twitter/callback'
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



app.use(passport.initialize())
app.use(passport.session())


//////////////////
// Define routes.
app.get('/',
  function(req, res) {
    res.render('home', { user: req.user });
  });

app.get('/login',
  function(req, res){
    res.render('login');
  });

app.get('/login/facebook',
  passport.authenticate('facebook'));

app.get('/auth/facebook/callback',
  passport.authenticate('facebook', {
    successRedirect: '/dashboard',
    failureRedirect: '/login'
  })
);

app.get('/profile',
  require('connect-ensure-login').ensureLoggedIn(),
  function(req, res){
    res.render('profile', { user: req.user });
  });

///////////////



app.get('/', (req, res) => {
  res.send('Hello World')
})

app.post('/login', passport.authenticate('local', {failureRedirect: '/login'}), (req, res) => {
  res.redirect('/dashboard')
})

// show sign up form
app.get('/signup', controller.formSignUp)

// process sign up / insert data into database
app.post('/signup/add', controller.processSignUp)

app.get('/dashboard', (req, res, next) => {
  res.send('asdfasdfsf')
})


app.listen(port, () => {
  console.log('the server is running on port ', port);
})
