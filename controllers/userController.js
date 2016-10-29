const passport = require('passport');
const User = require('../models/user');


let formSignUp = (req, res, next) => {
  res.render('signup')
}

let processSignUp = (req, res, next) => {
  //console.log(req.body);
  console.log(`aaa`);
  User.register(new User({
    name        : req.body.name,
    username    : req.body.username,
    password    : req.body.password,
    email       : req.body.email,
    photo       : req.body.photo || false
  }), req.body.password, (err) => {
    if (err) {
      console.log(err);
      return res.redirect('/signup')
    } else {
      passport.authenticate('local')(req, res, () => {
        req.session.save((err) => {
          if (err) {
            return next(err);
          } else {
            res.redirect('/dashboard')
          }
        })
      })
    }
  })
}

let facebookLogin = (req, res, next) => {

}


// twitter

// facebook

// google


module.exports = {
  formSignUp: formSignUp,
  processSignUp: processSignUp
}
