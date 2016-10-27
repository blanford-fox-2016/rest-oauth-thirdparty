var express = require('express');
var router = express.Router();
var user = require('../models/user.js')
const passport = require('passport')

/* GET home page. */
router.get('/home', function(req, res, next) {
  res.render('home', { title: 'Ex-Passport' });
});

router.get('/register', function(req, res, next) {
  res.render('index', { title: 'Ex-Passport' });
});


router.post('/register', function(req, res, next) {
  user.register({
    username: req.body.username,
    email: req.body.email,
  }, req.body.password, function(err, result) {
    if (err) {
      res.render('/register', {alert: 'Registration unsuccessfull'})
    } else {
      passport.authenticate('local')(req, res, function(){
        req.session.save(function (err, next) {
          if (err) return next(err)
          res.redirect('/list')
        })
      })
    }
  })
})


router.get('/list', function(req, res, next) {
  user.find({}, function(err, data){
      if (err) {
        console.log(err);
      } else {
        console.log(data);
        res.render('list', {data})
      }
  })
})

router.get('/update/:id', function(req, res, next) {
  user.find({_id: req.params.id}, function(err, data){
    if (err) {
      console.log(err);
    } else {
      console.log(data);
      res.render('update', {data})
    }
  })
})

router.put('/update/:id', function(req, res, next) {
  user.update({
    _id: req.params.id
  },{
    username: req.body.username,
    email: req.body.email,
    password: req.body.password
  }, function(err, data) {
    if (err) {
      console.log(err);
    } else {
      console.log('data updated: ', data);
      res.redirect('/list')
    }
  })
})

router.delete('/delete/:id', function (req, res, next) {
  user.remove({_id: req.params.id}, function(err) {
    if (err) {
      return handleError(err)
    } else {
      console.log('data removed');
      res.redirect('/list')
    }
  })
})

router.get('/login', function(req, res, next) {
  res.render('login', {title:'Ex-Passport'})
})

router.post('/login', passport.authenticate('local'), function(req, res, next) {
  res.redirect('/list')
})

router.get('/logout', function(req, res, next) {
  req.logout()
  res.redirect('/home')
})


module.exports = router;
