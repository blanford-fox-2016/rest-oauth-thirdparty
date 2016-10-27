let passport = require('passport');
let User = require('../models/User');
// let passport = require('passport');
let LocalStrategy = require('passport-local').Strategy;

let all = (req, res, next) => {
  User.find({}, (err, users) => {
    if (err) {
      console.log(err);
    } else {
      res.json(users);
    }
  })
}

let register = (req, res, next) => {
  User.register({
    name: req.body.name,
    email: req.body.email,
    username: req.body.username,
    photo: req.body.photo
  }, req.body.password, (err, user) => {
    if (err) {
      res.render('index', { alert: 'Oh, snap! Your regisration was unsuccessfull!'})
    } else {
      // res.render('index', { alert: 'Congrats! Your regisration was successfull!', data: req.session});

      passport.authenticate('local')(req, res, function () {
        req.session.save((err, next) => {
          if (err) {
            return next(err);
          } else {
            res.redirect('/users/profile');
          }
        })
      });
    }
  })
}

let login = (req, res, next) => {
  req.session.save((err, next) => {
    if (err) {
      return next(err);
    } else {
      res.redirect('/users/profile');
    }
  })
}

let logout = (req, res, next) => {
  req.logout();
  res.redirect('/');
}

let profile = (req, res, next) => {
  if (req.session.passport && req.session.passport.user != undefined) {
    res.render('profile', {data: req.session});
  } else {
    res.redirect('/')
  }

}

let edit = (req, res, next) => {
  User.update({
    _id: req.params.id
  },
  {
    name: req.body.name,
    email: req.body.email,
    username: req.body.username,
    password: req.body.password,
    photo: req.body.photo
  }, (err, user) => {
    if (err) {
      console.log(err);
    } else {
      res.send('Data updated!' + user);
    }
  })
}

let destroy = (req, res, next) => {
  User.remove({
    _id: req.params.id
  }, (err, user) => {
    if (err) {
      console.log(err);
    } else {
      res.send('Data deleted!')
    }
  })
}

module.exports = {
  all: all,
  register: register,
  edit: edit,
  destroy: destroy,
  login: login,
  logout: logout,
  profile: profile
}
