const express = require('express');
const { Mongoose } = require('mongoose');
const router = express.Router();
const Destination = require('../models/Destination');
var util = require('../util');
var User = require('../models/User');

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
  Destination.create(destination, function(err, post){
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
  console.log(req.body);
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
      return res.redirect('/destination/'+req.params.id);
    }
    res.redirect('/destination_select');
  });
});

// 삭제
router.delete('/:id', function(req, res){
  Destination.findOneAndRemove({_id : req.params.id}, function(err){
    if(err) return res.json(err);
    res.redirect('/destination_select');
  });
});


module.exports = router;