var LocalStrategy = require('passport-local').Strategy
var FacebookStrategy = require('passport-facebook').Strategy
var	TwitterStrategy = require('passport-twitter').Strategy
var	GoogleStrategy = require('passport-google-oauth').OAuth2Strategy
var	User = require('../app/models/user')
var	configAuth = require('./auth')

module.exports = function(passport) {

    //passport setup
    passport.serializeUser(function(user, done) {
        done(null, user.id)
    })

    passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
            done(err, user)
        })
    })

    //LOCAL SIGNUP
    //using named strategies since we have one for login and one for signup. by default, if there was no name, it would be called 'local'
    passport.use('local-signup', new LocalStrategy({
        // by default, local strategy uses username and password, we will override with email
        usernameField : 'email',
        passwordField : 'password',
        passReqToCallback : true // allows us to pass back the entire request to the callback
    },
    function(req, email, password, done) {

        //asynchronous
        //User.findOne wont fire unless data is sent back
        process.nextTick(function() {

        //find a user whose email is the same as the forms email
        //we are checking to see if the user trying to login already exists
        User.findOne({ 'local.email' :  email }, function(err, user) {
            //if there are any errors, return the error
            if (err)
                return done(err)

            //check to see if theres already a user with that email
            if (user) {
                return done(null, false, req.flash('signupMessage', 'That email is already taken.'))
            } else {

                //if there is no user with that email, create the user
                var newUser            = new User()

                //set user's local credentials
                newUser.local.email    = email
                newUser.local.password = newUser.generateHash(password)

                //save the user
                newUser.save(function(err) {
                    if (err)
                        throw err;
                    return done(null, newUser)
                })
            }
        })
        })
    }))

    //LOCAL LOGIN
    passport.use('local-login', new LocalStrategy({
    	usernameField : 'email',
        passwordField : 'password',
        passReqToCallback : true
    },
    function(req,email,password,done){
    	User.findOne({'local.email' : email}, function(err,user){
    		if(err)
    			return done(err)

    		if(!user)
    			return done(null,false,req.flash('loginMessage','No user found!'))

    		if(!user.validPassword(password))
    			return done(null, false, req.flash('loginMessage','Wrong password!'))

    		return done(null,user)
    	})
    }))

    //FACEBOOK LOGIN
    passport.use(new FacebookStrategy({

        // pull in our app id and secret from our auth.js file
        clientID : configAuth.facebookAuth.clientID,
        clientSecret : configAuth.facebookAuth.clientSecret,
        callbackURL : configAuth.facebookAuth.callbackURL

    },
    //facebook will send back the token and profile
    function(token, refreshToken, profile, done) {

        //asynchronous
        process.nextTick(function() {
            //find the user in the database based on their facebook id
            User.findOne({ 'facebook.id' : profile.id }, function(err, user) {
                if (err)
                    return done(err)

                if (user) {
                    return done(null, user) //user found, return user
                } else {

                    //if there is no user found with that facebook id, create them
                    var newUser = new User()

                    //set all of the facebook information in our user model
                    newUser.facebook.id = profile.id //set the users facebook id
                    newUser.facebook.token = token //save the token that facebook provides to the user
                    newUser.facebook.name = profile.name //look at the passport user profile to see how names are returned
                    // newUser.facebook.email = profile.emails[0].value //facebook can return multiple emails so we'll take the first

                    // save our user to the database
                    newUser.save(function(err) {
                        if (err)
                            throw err

                        // if successful, return the new user
                        return done(null, newUser)
                    })
                }

            })
        })

    }))

    //TWITTER LOGIN
    passport.use(new TwitterStrategy({

        consumerKey     : configAuth.twitterAuth.consumerKey,
        consumerSecret  : configAuth.twitterAuth.consumerSecret,
        callbackURL     : configAuth.twitterAuth.callbackURL

    },
    function(token, tokenSecret, profile, done) {

        process.nextTick(function() {

            User.findOne({ 'twitter.id' : profile.id }, function(err, user) {
                if (err)
                    return done(err)

                if (user) {
                    return done(null, user)
                } else {
                    var newUser                 = new User()

                    newUser.twitter.id          = profile.id
                    newUser.twitter.token       = token
                    newUser.twitter.username    = profile.username
                    newUser.twitter.displayName = profile.displayName

                    newUser.save(function(err) {
                        if (err)
                            throw err
                        return done(null, newUser)
                    })
                }
            })
    })
    }))

    //GOOGLE LOGIN
    passport.use(new GoogleStrategy({

        clientID        : configAuth.googleAuth.clientID,
        clientSecret    : configAuth.googleAuth.clientSecret,
        callbackURL     : configAuth.googleAuth.callbackURL,

    },
    function(token, refreshToken, profile, done) {

        process.nextTick(function() {

            User.findOne({ 'google.id' : profile.id }, function(err, user) {
                if (err)
                    return done(err)

                if (user) {
                    return done(null, user)
                } else {
                    var newUser          = new User()

                    newUser.google.id    = profile.id
                    newUser.google.token = token
                    newUser.google.name  = profile.displayName
                    newUser.google.email = profile.emails[0].value //pull the first email

                    newUser.save(function(err) {
                        if (err)
                            throw err
                        return done(null, newUser)
                    })
                }
            })
        })

    }))
}
