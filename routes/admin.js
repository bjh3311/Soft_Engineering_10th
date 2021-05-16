// routes/Study.js

var express = require('express');
var router = express.Router();
var util = require('../util');
var Product = require('../models/Product');
var Post = require('../models/Post');

// Index
router.get('/index', util.isLoggedin, checkPermission,  function(req, res){
    res.render('admin/index');
});
router.get('/table', util.isLoggedin, checkPermission,  async function(req, res){
  posts = await Post.find();
    res.render('admin/table', {
    posts:posts
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
  products = await Product.find();
    res.render('admin/shop', {
    products:products
  });
});

  module.exports = router;

  function checkPermission(req, res, next){
    if(req.user.right == false) return util.noPermission(req,res);
    next();
  }