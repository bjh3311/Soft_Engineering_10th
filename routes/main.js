// routes/home.js
var express = require('express');
const Post = require('../models/Post');
var Review = require('../models/Review');
var router = express.Router();
var passport = require('../config/passport');
var Product = require('../models/Product');
var Cart = require('../models/cart');
var Destination = require('../models/Destination');
var expressLayouts = require('express-ejs-layouts');
var session = require('express-session');
const cart = require('../models/cart');



// Main
router.get('/', async function(req, res){
  var username = req.flash('username')[0];
  var errors = req.flash('errors')[0] || {};
  var limit = 4;
  try{
  var products = await Product.find()
    .where('flag').equals(true)
    .where('price').gte(0)
    .where('price').lte(60000)
    .sort('-createAt')
    .limit(limit) // 8
    .exec();

  var posts = await Post.find()
    .where('end').gte(new Date().toISOString().substring(0,10))
    .where('start').lte(new Date().toISOString().substring(0,10))
    .where('flag').equals(true)
    .sort('start')
    .exec();
  
  }catch(err){
    res.json(err);
  }
  res.render('main/index', {
      username:username,
      errors:errors,
      products:products,
      posts:posts
    });
});

router.get('/direct_buy',function(req,res){
  var username = req.flash('username')[0];
  var errors = req.flash('errors')[0] || {};

  res.render('main/orderform',{
    username:username,
    errors:errors,
  });
})

//구매 페이지
router.get('/review',function(req,res){
  var username = req.flash('username')[0];
  var errors = req.flash('errors')[0] || {};

  res.render('main/review',{
    username:username,
    errors:errors,
  });
})


//구매 페이지
router.get('/orderform',function(req,res){
  var username = req.flash('username')[0];
  var errors = req.flash('errors')[0] || {};

  res.render('main/orderform',{
    username:username,
    errors:errors,
  });
})

//게시판
router.get('/notice',function(req,res){
  var username = req.flash('username')[0];
  var errors = req.flash('errors')[0] || {};

  res.render('main/notice',{
    username:username,
    errors:errors,
  });
})

router.get('/notice_detail',function(req,res){
  var username = req.flash('username')[0];
  var errors = req.flash('errors')[0] || {};

  res.render('main/notice_detail',{
    username:username,
    errors:errors,
  });
})

//개인정보
router.get('/privacy', function(req, res){
  res.render('main/privacy');
});
// 이용약관
router.get('/policy', function(req, res){
  res.render('main/policy');
});

// 문의하기 화면
router.get('/inquire', function(req, res){
  var username = req.flash('username')[0];
  var errors = req.flash('errors')[0] || {};

  res.render('main/inquire',{
    username:username,
    errors:errors,
  });
});

//문의내역 화면
router.get('/inquire_list',function(req,res){
  var username = req.flash('username')[0];
  var errors = req.flash('errors')[0] || {};

  res.render('main/inquire_list',{
    username:username,
    errors:errors,
  });
})
//문의내역 상세화면
router.get('/inquire_detail',function(req,res){
  var username = req.flash('username')[0];
  var errors = req.flash('errors')[0] || {};

  res.render('main/inquire_detail',{
    username:username,
    errors:errors,
  });
})


// 배송지 선택
router.get('/destination_select', function (req, res) {
  var username = req.user.username;
  var errors = req.flash('errors')[0] || {};
  Destination.find({user: req.user.username })
    .exec(function (err, destination) {
      if (err) return res.json(err);
      res.render('main/destination_select', {
        destination: destination,
        username: username,
        errors: errors
      });
    });
});

// 배송지 추가
router.get('/destination_create', function(req,res){
var username = req.user.username;
var errors = req.flash('errors')[0] || {};

res.render('main/destination_create',{
  username:username,
  errors:errors
});
});


// 배송지 수정
router.get('/destination_edit', function(req, res){

});

router.post('/destination_edit', function(req, res){
  var destinationID = req.body.destinationId;
})


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
  //console.log(cart);
  /*cart.generateArray().forEach(function(element){
    console.log(element);
  })*/
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

router.get('/category', async function(req,res){
  var username = req.flash('username')[0];
  var errors = req.flash('errors')[0] || {};

  var page = Math.max(1, parseInt(req.query.page));
  var limit = Math.max(1, parseInt(req.query.limit));
  var origin = Math.max(0,parseInt(req.query.origin));

  var amount_start = Math.max(0,parseInt(req.query.amount_start));
  var amount_end = Math.min(60000,parseInt(req.query.amount_end));
  var sort = req.query.sort?req.query.sort:'-createAt';

  page = !isNaN(page)?page:1;
  limit = !isNaN(limit)?limit:3;
  origin =!isNaN(origin)?origin:0;
  amount_start = !isNaN(amount_start)?amount_start:0;
  amount_end = !isNaN(amount_end)?amount_end:60000;

  var searchQuery = createSearchQuery(req.query);
  var skip = (page-1)*limit; // 4
  var count = await Product.countDocuments(searchQuery);
  var maxPage = Math.ceil(count/limit);

  try{
  if(origin == 0){
  var products = await Product.find(searchQuery)
    .where('flag').equals(true)
    .where('price').gte(amount_start)
    .where('price').lte(amount_end)
    .sort(sort)
    .skip(skip)   // 8
    .limit(limit) // 8
    .exec();
  }else{
    var products = await Product.find(searchQuery)
    .where('origin').equals(origin)
    .where('flag').equals(true)
    .where('price').gte(amount_start)
    .where('price').lte(amount_end)
    .sort(sort)
    .skip(skip)   // 8
    .limit(limit) // 8
    .exec();
  }}
  catch(err){
    console.log(err);
  }
  res.render('main/category', {
    username:username,
    errors:errors,
    products:products,
    currentPage:page,
    maxPage:maxPage,
    limit:limit,
    origin:origin,
    searchText: req.query.searchText,
    amount_start:amount_start,
    amount_end:amount_end,
    sort:sort
  });
})



router.get('/:id', async function(req, res){
  var username = req.flash('username')[0];
  var errors = req.flash('errors')[0] || {};

  var page = Math.max(1, parseInt(req.query.page));
  var limit = Math.max(1, parseInt(req.query.limit));
  page = !isNaN(page)?page:1;
  limit = !isNaN(limit)?limit:1;

  var skip = (page-1)*limit; 
  var count = await Review.countDocuments({product:req.params.id});
  var maxPage = Math.ceil(count/limit);

  var product = await Product.findOne({_id:req.params.id})
    .exec();
  var review = await Review.find({product:req.params.id})
    .skip(skip)   
    .limit(limit)
    .exec();
  res.render('main/detail',{
    username:username,
    product:product,
    review:review,
    errors: errors,
    currentPage:page,
    maxPage:maxPage,
    limit:limit
  })
});

// Post Login
// 주문 내역
router.get('/order_list',function(req,res){
  var username = req.flash('username')[0];
  var errors = req.flash('errors')[0] || {};
  res.render('main/order_list',{
    username:username,
    errors:errors
  });
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

function createSearchQuery(queries){ // 4
  var searchQuery = {};
  if(queries.searchText && queries.searchText.length >= 2){
    //var searchTypes = queries.searchType.toLowerCase().split(',');
    var productQueries = [];
    productQueries.push({ name: { $regex: new RegExp(queries.searchText, 'i') } });

    /*
    if(searchTypes.indexOf('body')>=0){
      productQueries.push({ body: { $regex: new RegExp(queries.searchText, 'i') } });
    }*/
    if(productQueries.length > 0) searchQuery = {$or:productQueries};
  }
  return searchQuery;
}
