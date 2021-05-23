// routes/home.js

var express = require('express');
var router = express.Router();
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

router.get('/destination_select',function(req,res){
  res.render('main/destination_select');
});

// 배송지 추가/수정
router.get('/destination_create',function(req,res){
  res.render('main/destination_create');
});

router.get('/test',function(req,res){
  res.render('main/test.php');
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

  res.render('main/cart', {
    username:username,
    errors:errors,
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
  console.log(req.query);
  var username = req.flash('username')[0];
  var errors = req.flash('errors')[0] || {};

  var page = Math.max(1, parseInt(req.query.page));
  var limit = Math.max(1, parseInt(req.query.limit));
  var origin = Math.max(0,parseInt(req.query.origin));

  var amount_start = Math.max(0,parseInt(req.query.amount_start));
  var amount_end = Math.min(1000000,parseInt(req.query.amount_end));
  var sort = req.query.sort?req.query.sort:'-createAt';

  page = !isNaN(page)?page:1;
  limit = !isNaN(limit)?limit:3;
  origin =!isNaN(origin)?origin:0;
  amount_start = !isNaN(amount_start)?amount_start:0;
  amount_end = !isNaN(amount_end)?amount_end:1000000;

  var searchQuery = createSearchQuery(req.query);
  var skip = (page-1)*limit; // 4
  var count = await Product.countDocuments(searchQuery);
  var maxPage = Math.ceil(count/limit);

  try{
  if(origin == 0){
  var products = await Product.find(searchQuery)
    .sort(sort)
    .skip(skip)   // 8
    .limit(limit) // 8
    .exec();
  }else{
    var products = await Product.find(searchQuery)
    .where('origin').equals(origin)
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
// 주문 내역
router.get('/order_list',function(req,res){
  var username = req.flash('username')[0];
  var errors = req.flash('errors')[0] || {};
  res.render('main/order_list',{
    username:username,
    errors:errors
  });
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
