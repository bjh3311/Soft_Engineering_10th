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
  origin =!isNaN(origin)?origin:0;                    

  var searchQuery = createSearchQuery(req.query);
  //console.log(searchQuery);
 
  if(origin == 0){
  var products = await Product.find(searchQuery)
    .sort('-createdAt')
    .exec();
  }else{
    var products = await Product.find({'origin' : origin},searchQuery)
    .sort('-createdAt')
    .exec();
  }
  res.render('admin/shop', {
    products:products,
    origin:origin,
    searchText: req.query.searchText
  });
});

router.get('/test',util.isLoggedin, checkPermission, function(req,res){
  console.log(req.body);
  res.redirect('/admin/shop');
})




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