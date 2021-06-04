var express = require('express');
var router = express.Router();
var Product = require('../models/Product');

router.post('/', function(req, res){
  res.redirect('/pay_complete');
});

router.get('/pay_complete', function(req, res){
  res.render('main/pay_complete');
});

module.exports = router;