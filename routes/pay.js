var express = require('express');
var router = express.Router();
var Product = require('../models/Product');
var Order = require('../models/Order');
var moment = require('moment');

router.post('/', function(req, res){
  const order = new Order({
    payDate : moment().format('YYYY-MM-DD'),
    orderNum : moment().format('YYYYMMDDHHmmss'),
    user : req.user._id,
    cart : req.session.cart,
    deliverName : req.body.deliverName,
    address : req.body.roadAddress + req.body.detailAddress,
    contact : req.body.contact,
    message : req.body.message
  });
  Order.create(order, function(err, order){
    if(err) return res.json(err);
    res.redirect('/pay/pay_complete');
  });
});

router.get('/pay_complete', function(req, res){
  delete req.session.cart;
 
  Order.findOne({user : req.user._id}, function(err, order){
    res.render('main/pay_complete',{
      orderNum : order.orderNum,
      totalPrice : order.cart.totalPrice
    });
  });
  
});

module.exports = router;