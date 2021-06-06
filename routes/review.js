var express = require('express');
var router = express.Router();
var Review = require('../models/Review');
var Product = require('../models/Product');
var util = require('../util');
var path = require('path');
var moment = require('moment');
const { checkout } = require('./products');

router.get('/:id', util.isLoggedin, async function(req,res){
    console.log("Get Review");

    var review = req.flash('review')[0]; 
    var errors = req.flash('errors')[0] || {};
    var orderNum=req.query.orderNum;
    var product = await Product.findById({_id:req.params.id});
    res.render('main/review',{
        user:req.user,
        product:product,
        review:review,
        errors:errors,
        orderNum:orderNum
    });
})          


router.post('/:product_id',util.isLoggedin, function(req, res){
    var query = req.body;
    query['user'] = req.user.username;
    query['product']=req.params.product_id;
    Review.create(query, function(err, Review){
        if(err){
          req.flash('review', query);
          req.flash('errors', util.parseError_(err));
          return res.redirect('/review/'+req.params.product_id+'?'+req.body.orderNum);
        }
        res.redirect('/'+req.params.product_id);
      });
});

module.exports = router;