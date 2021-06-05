var express = require('express');
var router = express.Router();
var Product = require('../models/Product');
var Order = require('../models/Order');
var moment = require('moment');
const Destination = require('../models/Destination');

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
    res.redirect('/pay/pay_complete/' + order.orderNum);
  });
});


router.get('/pay_complete/:id', function(req, res){
  delete req.session.cart;
  Order.findOne({orderNum : req.params.id}, function(err, order){
    res.render('main/pay_complete',{
      orderNum : order.orderNum,
      totalPrice : order.cart.totalPrice
    });
  });
});


router.post('/direct_buy', function(req, res){
  const order = new Order({
    payDate : moment().format('YYYY-MM-DD'),
    orderNum : moment().format('YYYYMMDDHHmmss'),
    user : req.user._id,
    cart : {
      items : {
        ID :  {
          item : {
            name : req.body.productName
          },
          sales : req.body.count,
          price : req.body.totalPrice
        }
      },
      totalQty : 1,
      totalPrice : req.body.totalPrice
    },
    deliverName : req.body.deliverName,
    address : req.body.roadAddress + req.body.detailAddress,
    contact : req.body.contact,
    message : req.body.message
  });
  Order.create(order, function(err, order){
    if(err) return res.json(err);
    res.redirect('/pay/pay_complete_direct/' + order.orderNum);
  });
});

router.get('/:id/direct_buy', function(req, res){
  var username = req.flash('username')[0];
  var errors = req.flash('errors')[0] || {};

  Destination.findOne({_id : req.user.address}, function(err, destination){
    Product.findOne({_id : req.params.id}, function(err, product){
      res.render('main/direct_buy',{
        username:username,
        errors:errors,
        destination : [destination],
        product : product
      });
    });
  });
});


router.get('/pay_complete_direct/:id', function(req, res){
  Order.findOne({orderNum : req.params.id}, function(err, order){
    res.render('main/pay_complete_direct',{
      orderNum : order.orderNum,
      totalPrice : order.cart.totalPrice
    });
  });
  
});



module.exports = router;