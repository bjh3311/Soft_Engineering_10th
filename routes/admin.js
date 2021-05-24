// routes/Study.js

var express = require('express');
var router = express.Router();
var util = require('../util');
var Product = require('../models/Product');
var Post = require('../models/Post');
var moment = require('moment');



// Index
router.get('/index', util.isLoggedin, checkPermission,  function(req, res){
    res.render('admin/index');
});
router.get('/table', util.isLoggedin, checkPermission,  async function(req, res){
  posts = await Post.find();
    res.render('admin/table', {
    posts:posts,
    moment
  });
});

router.get('/table_delete', util.isLoggedin, checkPermission, function(req,res){
  res.render('admin/table_delete');
});

router.get('/table_detail',util.isLoggedin, checkPermission, function(req,res){
  res.render('admin/table_detail')
})

router.get('/form_create', util.isLoggedin, checkPermission, function(req, res){
    res.render('admin/form_create');
});

router.get('/form_update', util.isLoggedin, checkPermission, function(req, res){
    res.render('admin/form_update');
});

router.get('/register', util.isLoggedin, checkPermission, function(req, res){
    res.render('admin/register');
});

router.get('/detail', util.isLoggedin, checkPermission, function(req, res){
  console.log("admin");
  res.render('admin/detail');
});
router.get('/modify',util.isLoggedin, checkPermission,  function(req, res){
    res.render('admin/modify');
});

// 주문 내역
router.get('/order_list',util.isLoggedin, checkPermission, function(req,res){
  res.render('admin/order_list');
});

// 판매 정보 통계
router.get('/sales_statistics',util.isLoggedin, checkPermission, function(req,res){
  res.render('admin/sales_statistics');
});

// 상품 관리

router.get('/shop',util.isLoggedin, checkPermission,  async function(req,res){
  var origin = Math.max(0,parseInt(req.query.origin));
  var amount_start = Math.max(0,parseInt(req.query.amount_start));
  var amount_end = Math.min(1000000,parseInt(req.query.amount_end));
  var sort = req.query.sort?req.query.sort:'-createAt';
 
  origin =!isNaN(origin)?origin:0;
  amount_start = !isNaN(amount_start)?amount_start:0;
  amount_end = !isNaN(amount_end)?amount_end:1000000;

  var searchQuery = createSearchQuery(req.query);
  //console.log(searchQuery);

  if(origin == 0){
  var products = await Product.find(searchQuery)
    .sort(sort)
    .exec();
  }else{
    var products = await Product.find({'origin' : origin},searchQuery)
    .where('origin').equals(origin)
    .sort(sort)
    .exec();
  }
  res.render('admin/shop', {
    products:products,
    origin:origin,
    searchText: req.query.searchText,
    amount_start:amount_start,
    amount_end:amount_end,
    sort:sort
  });
});


module.exports = router;

function checkPermission(req, res, next){
  if(req.user.right == false) return util.noPermission(req,res);
  next();
}

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
