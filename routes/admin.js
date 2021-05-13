// routes/Study.js

var express = require('express');
var router = express.Router();
var Product = require('../models/Product');
var Post = require('../models/Post');

// Index
router.get('/index', function(req, res){
    res.render('admin/index');
});
router.get('/table', async function(req, res){
  posts = await Post.find();
    res.render('admin/table', {
    posts:posts
  });
});

router.get('/table_delete',function(req,res){
  res.render('admin/table_delete');
});

router.get('/table_detail',function(req,res){
  res.render('admin/table_detail')
})

router.get('/form_create', function(req, res){
    res.render('admin/form_create');
});

router.get('/form_update', function(req, res){
    res.render('admin/form_update');
});

router.get('/register', function(req, res){
    res.render('admin/register');
});

router.get('/detail', function(req, res){
  res.render('admin/detail');
});
router.get('/modify', function(req, res){
    res.render('admin/modify');
});

// 주문 내역
router.get('/order_list',function(req,res){
  res.render('admin/order_list');
});

// 판매 정보 통계
router.get('/sales_statistics',function(req,res){
  res.render('admin/sales_statistics');
});

// 상품 관리

router.get('/shop', async function(req,res){
  products = await Product.find();
    res.render('admin/shop', {
    products:products
  });
});

  module.exports = router;
