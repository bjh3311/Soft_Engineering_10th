// routes/Study.js

var express = require('express');
var router = express.Router();
var Product = require('../models/Product');
var util = require('../util');

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

  module.exports = router;
