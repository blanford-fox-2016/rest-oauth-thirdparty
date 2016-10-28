'use strict'
//require to passport oauth
var LocalStrategy    = require('passport-local').Strategy;
var FacebookStrategy = require('passport-facebook').Strategy;
var TwitterStrategy  = require('passport-twitter').Strategy;
var GoogleStrategy   = require('passport-google-oauth').OAuth2Strategy;

//calling data schem from model
var User = require ('../models/user')
// load the auth variables
var configAuth = require('./auth'); // use this one for testing
module.exports = (passport) => {
  // session
  passport.serializeUser((user, done) => {//serialize
      done(null, user.id);
  });

  passport.deserializeUser((id, done) => {//deserialize
      User.findById(id, (err, user) => {
          done(err, user);
      });
    });

  //local login
  passport.use('local-login',new LocalStrategy({
    usernameField : 'email',
    passwordField : 'password',
    passReqToCallback : true // pass in the req to check loggin user
    },
    (req, email, password, done) => {
      if (email)
          email = email.toLowerCase(); //lowercase to emailsensitive

      // asynchronous
      process.nextTick(() => {
          User.findOne({ 'local.email' :  email }, (err, user) => {
              // if there are any errors, return the error
              if (err)
                  return done(err);
              // if no user is found, return the message
              if (!user)
                  return done(null, false, req.flash('loginMessage', 'No user found.'));

              if (!user.validPassword(password))
                  return done(null, false, req.flash('loginMessage', 'Oops! Wrong password.'));
              // all is well, return user
              else
                  return done(null, user);
            });
        });
    }));
    //local signup
    passport.use('local-signup', new LocalStrategy({
      usernameField : 'email',
      passwordField : 'password',
      passReqToCallback : true // pass in the req to check loggin user
      },
      (req, email, password, done) => {
        if (email)
            email = email.toLowerCase();//lowercase to emailsensitive
        //asynchronous
        process.nextTick(() => {
          if(!req.user){
          //find to check user email
            User.findOne({'local.email' : email }, (err,user) => {
              if (err)
              //return for error
                return done(err)
              if(user)
              {//user found email already exist
                return done(null,false,req.flash('signupMessage', 'That email is already taken.'));
              }//there is no user with same email regist
              else {

                var newUser            = new User();
                newUser.local.email    = email;
                newUser.local.password = newUser.generateHash(password);
                newUser.save(function(err) {
                    if (err)
                        return done(err);
                    return done(null, newUser);
                });

              }
            });
          }
          // if the user is logged in but has no local accou
          else if ( !req.user.local.email ) {
             // ...presumably they're trying to connect a local account
             User.findOne({ 'local.email' :  email }, (err, user) => {
                 if (err)
                     return done(err);

                 if (user) {
                     return done(null, false, req.flash('loginMessage', 'That email is already taken.'));
                     // Using 'loginMessage instead of signupMessage because it's used by /connect/local'
                 } else {
                     var user = req.user;
                     user.local.email = email;
                     user.local.password = user.generateHash(password);
                     user.save(function (err) {
                         if (err)
                             return done(err);

                         return done(null,user);
                     });
                 }
             });
         }

        else {
        // user is logged in and already has a local account. Ignore signup
          return done(null, req.user);
         }

        })
    }))

    //facebookAuth
    passport.use(new FacebookStrategy({
      clientID        : configAuth.facebookAuth.clientID, // your App ID
      clientSecret    : configAuth.facebookAuth.clientSecret, // your App Secret
      callbackURL     : configAuth.facebookAuth.callbackURL,
      passReqToCallback : true
    },
    (req, token, refreshToken, profile, done) => {
        // asynchronous
        process.nextTick(() => {
            // check if the user is already logged in
            if (!req.user) {
                User.findOne({ 'facebook.id' : profile.id }, function(err, user) {
                    if (err)
                        return done(err);
                    if (user) {
                        // if there is a user id already but no token (user was linked at one point and then removed)
                        if (!user.facebook.token) {
                            user.facebook.token = token;
                            user.facebook.name  = profile.name.givenName + ' ' + profile.name.familyName;
                            user.facebook.email = (profile.emails[0].value || '').toLowerCase();
                            user.save((err) => {
                                if (err) return done(err);
                                return done(null, user);
                            });
                        }
                        return done(null, user); // user found, return that user
                    } else {
                        // if there is no user, create them
                        var newUser            = new User();

                        newUser.facebook.id    = profile.id;
                        newUser.facebook.token = token;
                        newUser.facebook.name  = profile.name.givenName + ' ' + profile.name.familyName;
                        newUser.facebook.email = (profile.emails[0].value || '').toLowerCase();
                        //new user created save/ has been created
                        newUser.save((err) => {
                            if (err)
                                return done(err);

                            return done(null, newUser);
                        });
                    }
                });

            } else {
                // user already exists and is logged in, we have to link accounts
                var user            = req.user; // pull the user out of the session

                user.facebook.id    = profile.id;
                user.facebook.token = token;
                user.facebook.name  = profile.name.givenName + ' ' + profile.name.familyName;
                user.facebook.email = (profile.emails[0].value || '').toLowerCase();

                user.save((err) => {
                    if (err)
                        return done(err);
                    return done(null, user);
                });

            }
        });

    }));

    //TWITEER

    passport.use(new TwitterStrategy({

        consumerKey     : configAuth.twitterAuth.consumerKey,
        consumerSecret  : configAuth.twitterAuth.consumerSecret,
        callbackURL     : configAuth.twitterAuth.callbackURL,
        passReqToCallback : true // check if a user is logged in or not

    },
    (req, token, tokenSecret, profile, done) => {
        // asynchronous
        process.nextTick(()=> {

            // check if the user is already logged in
            if (!req.user) {

                User.findOne({ 'twitter.id' : profile.id }, (err, user) => {
                    if (err)
                        return done(err);

                    if (user) {
                        // if there is a user id already but no token (user was linked at one point and then removed)
                        if (!user.twitter.token) {
                            user.twitter.token       = token;
                            user.twitter.username    = profile.username;
                            user.twitter.displayName = profile.displayName;

                            user.save(function(err) {
                                if (err)
                                    return done(err);

                                return done(null, user);
                            });
                        }

                        return done(null, user); // user found, return that user
                    } else {
                        // if there is no user, create them
                        var newUser                 = new User();

                        newUser.twitter.id          = profile.id;
                        newUser.twitter.token       = token;
                        newUser.twitter.username    = profile.username;
                        newUser.twitter.displayName = profile.displayName;

                        newUser.save(function(err) {
                            if (err)
                                return done(err);

                            return done(null, newUser);
                        });
                    }
                });

            } else {
                // user already exists and is logged in, we have to link accounts
                var user = req.user; // pull the user out of the session

                user.twitter.id = profile.id;
                user.twitter.token = token;
                user.twitter.username = profile.username;
                user.twitter.displayName = profile.displayName;

                user.save((err) => {
                    if (err)
                        return done(err);

                    return done(null, user);
                });
            }

        });

    }));

    //Google

    passport.use(new GoogleStrategy({

        clientID : configAuth.googleAuth.clientID,
        clientSecret : configAuth.googleAuth.clientSecret,
        callbackURL : configAuth.googleAuth.callbackURL,
        passReqToCallback : true  //check if a user is logged in or not

    },
    (req, token, refreshToken, profile, done) => {

        // asynchronous
        process.nextTick(() => {

            // check if the user is already logged in
            if (!req.user) {

                User.findOne({ 'google.id' : profile.id }, (err, user)=> {
                    if (err)
                        return done(err);

                    if (user) {

                        // if there is a user id already but no token (user was linked at one point and then removed)
                        if (!user.google.token) {
                            user.google.token = token;
                            user.google.name  = profile.displayName;
                            user.google.email = (profile.emails[0].value || '').toLowerCase(); // pull the first email

                            user.save((err) => {
                                if (err)
                                    return done(err);

                                return done(null, user);
                            });
                        }

                        return done(null, user);
                    } else {
                        var newUser  = new User();

                        newUser.google.id  = profile.id;
                        newUser.google.token = token;
                        newUser.google.name  = profile.displayName;
                        newUser.google.email = (profile.emails[0].value || '').toLowerCase(); // pull the first email

                        newUser.save((err) => {
                            if (err)
                                return done(err);

                            return done(null, newUser);
                        });
                    }
                });

            } else {
                // link accounts
                var user = req.user; // pull the user out of the session

                user.google.id = profile.id;
                user.google.token = token;
                user.google.name  = profile.displayName;
                user.google.email = (profile.emails[0].value || '').toLowerCase(); // pull the first email

                user.save((err) => {
                    if (err)
                        return done(err);
                    return done(null, user);
                });

            }

        });

    }));

}
