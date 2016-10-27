'use strict'

var express = require('express');
var router = express.Router();
var user = require('../models/user.js')
const passport = require('passport')



module.exports = {
  index:function (req, res, next) {
    res.redirect('/home')
  },
  home:function(req, res, next) {
    if (req.user) {
      res.render('home', { title: 'Ex-Passport', user: req.user});
    } else {
      res.render('home', { title: 'Ex-Passport'});
    }
  },
  registerPage:function(req, res, next) {
    if (req.user) {
      res.redirect('/home')
    } else {
      res.render('index', { title: 'Ex-Passport' });
    }
  },
  registerSchema:function(req, res, next) {
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
  },
  listPage:function(req, res, next) {
    if (req.user) {
      user.find({}, function(err, data){
          if (err) {
            console.log(err);
          } else {
            console.log(data);
            res.render('list', {data:data, user:req.user})
          }
      })
    } else {
      res.redirect('/login')
    }
  },
  getUpdate:function(req, res, next) {
    user.find({_id: req.params.id}, function(err, data){
      if (err) {
        console.log(err);
      } else {
        console.log(data);
        res.render('update', {data})
      }
    })
  },
  putUpdate:function(req, res, next) {
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
        res.redirect('/list')
      }
    })
  },
  deleteUser:function (req, res, next) {
    user.remove({_id: req.params.id}, function(err) {
      if (err) {
        return handleError(err)
      } else {
        console.log('data removed');
        res.redirect('/list')
      }
    })
  },
  loginPage:function(req, res, next) {
    if (req.user) {
      res.redirect('/home')
    } else {
      res.render('login', {title:'Ex-Passport'})
    }
  },
  authentication:function(req, res, next) {
    res.redirect('/list')
  },
  logout:function(req, res, next) {
    req.logout()
    res.redirect('/home')
  }
}
