// routes/home.js

var express = require('express');
var router = express.Router();
var passport = require('../config/passport');

// Main
router.get('/', function(req, res){
  var username = req.flash('username')[0];
  var errors = req.flash('errors')[0] || {};
  res.render('main/index', {
    username:username,
    errors:errors
  });
});

//개인정보
router.get('/privacy', function(req, res){
  res.render('main/privacy');
});
// 이용약관
router.get('/policy', function(req, res){
  res.render('main/policy');
});


// Post Login // 3
router.post('/login',
  function(req,res,next){
    var errors = {};
    var isValid = true;

    if(!req.body.username){
      isValid = false;
      errors.username = 'Username is required!';
    }
    if(!req.body.password){
      isValid = false;
      errors.password = 'Password is required!';
    }

    if(isValid){
      next();
    }
    else {
      req.flash('errors',errors);
      res.redirect('/');
    }
  },
  passport.authenticate('local-login', {
    successRedirect : '/',
    failureRedirect : '/'
  }
));

// Logout // 4
router.get('/logout', function(req, res) {
  req.logout();
  res.redirect('/');
});

module.exports = router;