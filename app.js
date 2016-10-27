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
passport.use(new LocalStrategy(User.authenticate()));
app.use(passport.initialize())
app.use(passport.session())



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
