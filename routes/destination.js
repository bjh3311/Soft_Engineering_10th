const express = require('express');
const { Mongoose } = require('mongoose');
const router = express.Router();
const Destination = require('../models/Destination');
var util = require('../util');
var User = require('../models/User');
const { route } = require('./products');

// create
router.post('/', function(req, res){
  const destination = new Destination({
    user : req.body.username,
    name : req.body.destination_name,
    post : req.body.postcode,
    roadAddress : req.body.roadAddress,
    detailAddress : req.body.detailAddress,
    contact : req.body.destination_number
  });
  Destination.create(destination, function(err, destination){
    if(err){
      req.flash('destination', destination);
      req.flash('errors', util.parseError_(err));
      return res.redirect('/destination_create');
    }
    res.send("<script>window.opener.location.reload();window.close(); </script>");
  });
});

// show
router.get('/:id', function(req, res){
  var destination = req.flash('destination')[0];
  var errors = req.flash('errors')[0] || {};

  Destination.findOne({_id : req.query.destinationId})
    .exec(function(err, destination){
      if(err) return res.json(err);
      res.render('main/destination_edit', { 
        destinationArray : [destination], 
        destination : destination,
        errors : errors
      });
    });
});

// 수정
router.put('/:id/edit', function(req, res){
  var update = {
    name : req.body.destination_name,
    post : req.body.postcode,
    roadAddress : req.body.roadAddress,
    detailAddress : req.body.detailAddress,
    contact : req.body.destination_number
  }
  Destination.findByIdAndUpdate({_id : req.params.id}, update, {runValidators: true }, function(err, destination){
    if(err){
      req.flash('destination', update);
      req.flash('errors', util.parseError_(err));
      return res.redirect('/destination/'+req.params.id+'/edit');
    }
    res.redirect('/destination_select');
  });
});

router.get('/:id/edit', function(req, res){
  var destination = req.flash('destination')[0];
  var errors = req.flash('errors')[0] || {};
  if(!destination){
    Destination.findOne({_id:req.params.id}, function(err, destination){
      if(err) return res.json(err);
      res.render('main/destination_edit', {
        destination : destination,
        destinationArray : [destination],
        errors : errors
      });
    });
  }
  else{
    destination._id = req.params.id;
    res.render('main/destination_edit', {
      destination : destination,
      destinationArray : [destination],
      errors : errors
    });
  }
});

// 삭제
router.delete('/:id', function(req, res){
  Destination.findOneAndRemove({_id : req.params.id}, function(err){
    if(err) return res.json(err);
    res.redirect('/destination_select');
  });
});

//기본 배송지 선택
router.post('/:id/select', function (req, res) {
  var userID = req.user.id;
  var destinationID = req.params.id;

  Destination.findOne({ _id: destinationID }).exec((err, data) => {
    User.findOne({ _id: userID }, function (err, userdata) {
      if (err) return res.json(err);

      User.findOneAndUpdate({_id : userID}, { address : data._id}, function(err, data){
         if (err) return res.json(err);
         res.send("<script>window.opener.location.reload();window.close(); </script>");
      });
    });
  });
});



module.exports = router;