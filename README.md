# rest-oauth-thirdparty

## What you need to install in your local respitory

#### Install express

```
/* first you need to install globally to use express generator */

npm install -g express

/* after that go to your local respitory project and using generate by using
command below (ejs is engine view) */

express --ejs

/* install all packages  in package.json dependencies */

npm install
```

#### Install mongodb

```
/* first you need to install globally */

sudo apt-get install -y mongodb-org

/* install localy in your respitory */

npm install --save mongodb
```

#### Install mongoose

```
npm install --save mongoose
```

#### Install express-session

```
npm install --save express-session
```

#### Install passport

```
npm install --save passport
```

#### Install passport-local

```
npm install --save passport-local
```

#### Install passport-local-mongoose

```
npm install --save passport-local-mongoose
```

## Models Setup

```
var mongoose = require('mongoose')

var passportLocalMongoose = require('passport-local-mongoose')

var profileSchema = new mongoose.Schema({
    name: String,
    password: String,
    username: String,
    email: String
})

profileSchema.plugin(passportLocalMongoose)

var Profile = mongoose.model('profile', profileSchema)

module.exports = Profile
```

## Local Register Setup

```
var passport = require('passport')

var LocalStrategy = require('passport-local').Strategy;

passport.use(new LocalStrategy(Profile.authenticate()))

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
```

## Twitter Register Setup

```
var passport = require('passport')

var TwitterStrategy = require('passport-twitter').Strategy

passport.use(new TwitterStrategy({
      consumerKey: <CONSUMER_KEY>,
      consumerSecret: <CONSUMTER_SECRET,
      callbackURL: <CALLBACK_URL>
    },
    function(token, tokenSecret, profile, done) {
      Profile.findOneAndUpdate({
        username: profile.username
      }, {
        name: profile.displayName,
        username: profile.username,
        email: profile.username + '@twitter.com' //tidak ada email
      }, {
        upsert: true
      }, function(err, user) {
        if (err) { return done(err); }
        done(null, user);
      })
    }
))
```

## Facebook Register Setup

```
var passport = require('passport');

var FacebookStrategy = require('passport-facebook').Strategy

passport.use(new FacebookStrategy({
        clientID: <CLIENT_ID>,
        clientSecret: <CLIENT_SECRET>,
        callbackURL: <CALLBACK_URL>,
        profileFields: ['id', 'displayName', 'photos', 'email'],
        passReqToCallback: true
    },
    function(req, accessToken, refreshToken, profile, done) {
        console.log(profile)
      Profile.findOneAndUpdate({
        username: profile.username
      }, {
        name: profile.displayName,
        username: profile.username,
        email: profile.displayName
      }, {
        upsert: true
      }, function(err, user) {
        if (err) { return done(err); }
        done(null, user);
      })
    }
))
```

## Google Register Setup

```
var passport = require('passport');

var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy

passport.use(new GoogleStrategy({
      clientID: config.googleAuth.clientId,
      clientSecret: config.googleAuth.clientSecret,
      callbackURL: config.googleAuth.callBackURL
    },
    function(accessToken, refreshToken, profile, done) {
      Profile.findOneAndUpdate({
        username: profile.username
      }, {
        name: profile.displayName,
        username: profile.username,
        email: profile.emails[0].value
      }, {
        upsert: true
      }, function(err, user) {
        if (err) { return done(err); }
        done(null, user);
      })
    }
))
```

## Local Router Setup

```
router.post('/', function (req, res, next) {
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
```

## Twitter Router Setup

```
router.get('/twitter',
    passport.authenticate('twitter')
)

router.get('/twitter/callback',
    passport.authenticate('twitter', {
        successRedirect: '/home',
        failureRedirect: '/',
        failureFlash: true
    })
)
```

## Facebook Router Setup

```
router.get('/facebook',
    passport.authenticate('facebook')
)

router.get('/facebook/callback',
    passport.authenticate('facebook', {
        successRedirect: '/home',
        failureRedirect: '/',
        failureFlash: true
    })
)
```

## Google Router Setup

```
router.get('/google',
    passport.authenticate('google', {scope: ['profile', 'email']})
)

router.get('/google/callback',
    passport.authenticate('google', {
        successRedirect: '/home',
        failureRedirect: '/',
        failureFlash: true
    })
)
```
