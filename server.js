//set up
var express = require ('express');
var app      = express();
var mongoose = require ('mongoose');
var passport = require ('passport');
var flash = require ('connect-flash');
var port = process.env.PORT || 3000;

var morgan = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser   = require('body-parser');
var session      = require('express-session');

//config to database
var configData = require ('./config/database.js');
mongoose.connect(configData.url);

//passport configuration
require ('./config/paspport.js')(passport)

//setup express
app.use(morgan('dev')); // log every request to the console
app.use(cookieParser()); // read cookies (needed for auth)
app.use(bodyParser.json()); // get information from html forms
app.use(bodyParser.urlencoded({ extended: true }));

app.set('view engine', 'ejs'); // set up ejs for templating

//set up passport
app.use(session({
    secret: 'asalajadeh', // session secret
    resave: true,
    saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session()); //  sessions
app.use(flash()); // use connect-flash for flash messages stored in session

// routes ======================================================================
require('./router.js')(app, passport); // load our routes and pass in our app and fully configured passport

// launch ======================================================================
app.listen(port);
console.log('The magic happens on port ' + port);
