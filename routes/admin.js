// routes/Study.js

var express = require('express');
var router = express.Router();
var util = require('../util');
var Product = require('../models/Product');
var Post = require('../models/Post');
var moment = require('moment');
var Order = require('../models/Order');
const Mongoose = require('mongoose');
var Review = require('../models/Review');


// Index
router.get('/index', util.isLoggedin, checkPermission,  function(req, res){
    res.render('admin/index');
});
router.get('/table', util.isLoggedin, checkPermission,  async function(req, res){
  var sort = req.query.sort?req.query.sort:'start';
  var startSearch = req.query.startSearch?req.query.startSearch:new Date(0);
  var endSearch = req.query.endSearch?req.query.endSearch:new Date('9999/12/31/00:00:00');

  posts = await Post.find()
    .where('start').gte(startSearch)
    .where('end').lte(endSearch)
    .sort(sort)
    .exec()
    res.render('admin/table', {
    posts:posts,
    startSearch:req.query.startSearch,
    endSearch:req.query.endSearch,
    sort:sort,
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
  var posts = req.flash('posts')[0] || {};
  var errors = req.flash('errors')[0] || {};
  var file = req.flash('file')[0] || {};
    res.render('admin/form_create',{
      posts:posts,
      errors:errors,
      file:file
    });
});

router.get('/form_update', util.isLoggedin, checkPermission, function(req, res){
  var errors = req.flash('errors')[0] || {};
    res.render('admin/form_update',{
      errors:errors
    });
});

router.get('/register', util.isLoggedin, checkPermission, function(req, res){
    var errors = req.flash('errors')[0] || {};
    var files = req.flash('files')[0] || {};
    console.log(files);
    res.render('admin/register',{
      errors:errors,
      files:files
    });
});

router.get('/detail', util.isLoggedin, checkPermission, function(req, res){
  res.render('admin/detail');
});
router.get('/modify',util.isLoggedin, checkPermission,  function(req, res){
  var errors = req.flash('errors')[0] || {};
  res.render('admin/modify',{
    errors:errors
  });
});

// ?????? ??????
router.get('/order_list',util.isLoggedin, checkPermission,  async function(req,res){
  var errors = req.flash('errors')[0] || {};

  var page = Math.max(1, parseInt(req.query.page));   // 2
  var limit = Math.max(1, parseInt(req.query.limit)); // 2
  var startSearch = req.query.startSearch?req.query.startSearch:"2021-01-01";
  var endSearch = req.query.endSearch?req.query.endSearch:"2099-12-31";
  page = !isNaN(page)?page:1;                         // 3
  limit = !isNaN(limit)?limit:8;                     // 3
  var skip = (page-1)*limit; // 4
  
  var count = await Order.countDocuments(); // 5
  var maxPage = Math.ceil(count/limit); // 6
  var order = await Order.find()
  .where('payDate').gte(startSearch)
  .where('payDate').lte(endSearch)
  .skip(skip)   // 8
  .limit(limit) // 8
  .sort('-payDate')
  .exec();

    res.render('admin/order_list',{
      startSearch:startSearch,
      endSearch:endSearch,
      errors:errors,
      order : order,
      currentPage : page,
      maxPage : maxPage,
      limit: limit
    });
});

// ?????? ?????? ???????????? -> ?????????
router.post('/order_list/:id/complete', function(req, res){
  var update = { flag : '?????????'};

  Order.findOneAndUpdate({_id : req.params.id}, update, function(err, order){
    if(err) return res.json(err);
    res.redirect('/admin/order_list');
  });
});

// ?????? ?????? ????????? -> ????????????
router.post('/order_list/:id/ing', function(req, res){
  var update = { flag : '????????????'};

  Order.findOneAndUpdate({_id : req.params.id}, update, function(err, order){
    if(err) return res.json(err);
    res.redirect('/admin/order_list');
  });
});


// ????????? ????????????
router.get('/order_list/:id/end', async function(req, res){

    var order = await Order.find({_id : req.params.id});

    console.log(order);

    console.log(order[0].orderNum);

    var review = await Review.find({ orderNum : order[0].orderNum });

    console.log(review);

    res.render('admin/reviewDetail', {
      review : review,
      moment
    });

});


// ?????? ?????? ??????
router.get('/sales_statistics',util.isLoggedin, checkPermission, function(req,res){
  res.render('admin/sales_statistics');
});

// ?????? ??????

router.get('/shop',util.isLoggedin, checkPermission,  async function(req,res){
  var origin = Math.max(0,parseInt(req.query.origin));
  var amount_start = Math.max(0,parseInt(req.query.amount_start));
  var amount_end = Math.min(60000,parseInt(req.query.amount_end));
  var sort = req.query.sort?req.query.sort:'-createAt';

  origin =!isNaN(origin)?origin:0;
  amount_start = !isNaN(amount_start)?amount_start:0;
  amount_end = !isNaN(amount_end)?amount_end:60000;

  var searchQuery = createSearchQuery(req.query);
  //console.log(searchQuery);

  if(origin == 0){
  var products = await Product.find(searchQuery)
    .where('price').gte(amount_start)
    .where('price').lte(amount_end)
    .sort(sort)
    .exec();
  }else{
    var products = await Product.find(searchQuery)
    .where('origin').equals(origin)
    .where('price').gte(amount_start)
    .where('price').lte(amount_end)
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

function createSearchQuery_(queries){ // 4
  var searchQuery = {};
  if(queries.searchText && queries.searchText.length >= 2){
    //var searchTypes = queries.searchType.toLowerCase().split(',');
    var productQueries = [];
    productQueries.push({ title: { $regex: new RegExp(queries.searchText, 'i') } });

    /*
    if(searchTypes.indexOf('body')>=0){
      productQueries.push({ body: { $regex: new RegExp(queries.searchText, 'i') } });
    }*/
    if(productQueries.length > 0) searchQuery = {$or:productQueries};
  }
  return searchQuery;
}
