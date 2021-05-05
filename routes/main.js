// routes/home.js

var express = require('express');
var router = express.Router();
var passport = require('../config/passport');
var Product = require('../models/Product');
// Main
router.get('/', async function(req, res){
  var username = req.flash('username')[0];
  var errors = req.flash('errors')[0] || {};
  var products = await Product.find();
    res.render('main/index', {
    username:username,
    errors:errors,
    products:products
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

//about us -- 
router.get('/about',function(req,res){
  res.render('main/about');
});


//contact하기 -- 
router.get('/contact-us',function(req,res){
  res.render('main/contact-us');
});

// cart -- 
router.get('/cart',function(req,res){
  res.render('main/cart');
})

// gallery --
router.get('/gallery',function(req,res){
  res.render('main/gallery',);
})

router.get('/category/:origin', async function(req,res){
  var username = req.flash('username')[0];
  var errors = req.flash('errors')[0] || {};
  var products = await Product.find({'origin':req.params.origin});
  
  res.render('main/category', {
    username:username,
    errors:errors,
    products:products
  });
})

router.get('/:id', function(req, res){
  var username = req.flash('username')[0];
  var errors = req.flash('errors')[0] || {};
  Product.findOne({_id:req.params.id})
    .exec(function(err, product){
      if(err) return res.json(err);
      res.render('main/detail', {
        username:username,
        errors:errors,
        product:product
      });
    });
});

// Post Login 
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
