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

//about us -- 찬미 추가
router.get('/about',function(req,res){
  var username = req.flash('username')[0];
  var errors = req.flash('errors')[0] || {};
  res.render('main/about',{
    username:username,
    errors:errors
  });
});


//contact하기 -- 찬미 추가
router.get('/contact-us',function(req,res){
  var username = req.flash('username')[0];
  var errors = req.flash('errors')[0] || {};
  res.render('main/contact-us',{
    username:username,
    errors:errors
  });
});

// cart -- 찬미
router.get('/cart',function(req,res){
  var username = req.flash('username')[0];
  var errors = req.flash('errors')[0] || {};
  res.render('main/cart',{
    username:username,
    errors:errors
  });
})

// gallery -- 찬미
router.get('/gallery',function(req,res){
  var username = req.flash('username')[0];
  var errors = req.flash('errors')[0] || {};
  res.render('main/gallery',{
    username:username,
    errors:errors
  });
})

// 주문 내역
router.get('/order_list',function(req,res){
  var username = req.flash('username')[0];
  var errors = req.flash('errors')[0] || {};
  res.render('main/order_list',{
    username:username,
    errors:errors
  });
})


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


// 찬미 추가
    if(!req.body.name){
      isValid=false;
      errors.name=' name is required!';
    }

    if(!req.body.email){
      isValid=false;
      erros.email='email is required!';
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
