// routes/home.js
var express = require('express');
var router = express.Router();
var passport = require('../config/passport');
var Product = require('../models/Product');
var Cart = require('../models/cart');
var expressLayouts = require('express-ejs-layouts');
var session = require('express-session'); 
const { render } = require('ejs');
const { request } = require('express');
const cart = require('../models/cart');



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

// layouts
router.use(expressLayouts);
router.get('/', (req,res) =>{
  res.render('main/', {username : username});
});

//개인정보
router.get('/privacy', function(req, res){
  res.render('main/privacy');
});
// 이용약관
router.get('/policy', function(req, res){
  res.render('main/policy');
});

router.get('/destination_select',function(req,res){
  res.render('main/destination_select');
});

// 배송지 추가/수정
router.get('/destination_create',function(req,res){
  res.render('main/destination_create');
});

//about us --
router.get('/about',function(req,res){

  var username = req.flash('username')[0];
  var errors = req.flash('errors')[0] || {};
  res.render('main/about',{
    username:username,
    errors:errors,
  });
});


//contact하기 --
router.get('/contact-us',function(req,res){

  var username = req.flash('username')[0];
  var errors = req.flash('errors')[0] || {};

  res.render('main/contact-us',{
    username:username,
    errors:errors,
  });
});

// cart --
router.get('/cart',function(req,res){
  var username = req.flash('username')[0];
  var errors = req.flash('errors')[0] || {};
  
  if(req.session.cart === undefined){
    return res.render('main/cart', {
      productArray : null,
      username:username,
      errors:errors
    });
  }
  var cart = new Cart(req.session.cart);
  res.render('main/cart', {
    username:username,
    errors:errors,
    productArray : cart.generateArray(), 
    totalPrice : cart.totalPrice
  });
})


// gallery --
router.get('/gallery',function(req,res){

  var username = req.flash('username')[0];
  var errors = req.flash('errors')[0] || {};

  res.render('main/gallery',{
    username:username,
    errors:errors,
  });
})

// order_list
router.get('/order_list',function(req,res){

  var username = req.flash('username')[0];
  var errors = req.flash('errors')[0] || {};

  res.render('main/order_list',{
    username:username,
    errors:errors,
  });
})

//shop detail
router.get('/detail', async function(req,res){
  var username = req.flash('username')[0];
  var errors = req.flash('errors')[0] || {};
  var products = await Product.find();

  res.render('main/detail', {
    username:username,
    errors:errors,
    product:products
  });
});


router.get('/category', async function(req,res){
  var username = req.flash('username')[0];
  var errors = req.flash('errors')[0] || {};
  var products = await Product.find();

  res.render('main/category', {
    username:username,
    errors:errors,
    products:products
  });
});


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

// cart
router.post('/Addcart/:id', function(req,res,next){
  var count = Number(req.body.count);
  var productId = req.params.id;
  var cart = new Cart(req.session.cart ? req.session.cart : {});
  Product.findOneAndUpdate({_id:productId}, count, function(err, product){
    if(err){
      req.flash('product', req.body);
      req.flash('errors', util.parseError(err));
      return res.redirect('/'+req.params.id);
    }
    cart.add(product, productId, count);
    req.session.cart = cart;
    res.redirect('/'+req.params.id);
  });
});

// cart conunt up
router.post('/up', function(req,res,next){
  var cart = new Cart(req.session.cart);
  var id = req.body.up;

  cart.addByOne(id);
  req.session.cart = cart;

  res.redirect('/cart');
});

// cart count down
router.post('/down', function(req,res,next){
  var cart = new Cart(req.session.cart);

  cart.reduceByOne(req.body.down);
  req.session.cart = cart;

  res.redirect('/cart');
});

// cart item remove
router.post('/remove', function(req, res, next){
  var cart = new Cart(req.session.cart);
  
  cart.removeItem(req.body.remove);
  req.session.cart = cart;

  res.redirect('/cart');
});


module.exports = router;
 