// routes/Study.js

var express = require('express');
var router = express.Router();
var Product = require('../models/Product');

// Index
router.get('/', function(req, res){
    res.render('admin/index');
});
router.get('/table', function(req, res){
    res.render('admin/table');
  });

router.get('/form', function(req, res){
    res.render('admin/form');
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

// 판매 정보 통계
router.get('/sales_statistics',function(req,res){
  res.render('admin/sales_statistics');
})

// 상품 관리

router.get('/shop', async function(req,res){
  products = await Product.find();
    res.render('admin/shop', {
    products:products
  });
});

  module.exports = router;
