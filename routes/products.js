var express = require('express');
var router = express.Router();
var Product = require('../models/Product');
var multer = require('multer');
var util = require('../util');

var storage  = multer.diskStorage({ // 2
    destination(req, file, cb) {
      cb(null, './public/upload');
    },
    filename(req, file, cb) {
      cb(null, `${file.originalname}`);
    },
  });
  var uploadWithOriginalFilename = multer({ storage: storage });

  //create
router.post('/', uploadWithOriginalFilename.single('attachment'), function(req, res){
    Product.create(req.body, function(err, product){
      if(err){
        req.flash('producuts', req.body);
        req.flash('errors', util.parseError(err));
        console.log(err);
        return res.redirect('/admin/register');
      }
      res.redirect('/admin/shop');
    });
  });

  // show
  router.get('/:id', function(req, res){
    Product.findOne({_id:req.params.id})
      .exec(function(err, product){
        if(err) return res.json(err);
        res.render('admin/detail', {product:product});
      });
  });

  // edit
  router.get('/:id/edit', function(req, res){
    var product = req.flash('product')[0];
    var errors = req.flash('errors')[0] || {};
    if(!product){
      Product.findOne({_id:req.params.id}, function(err, product){
          if(err) return res.json(err);
          res.render('admin/modify', { product:product, errors:errors });
        });
    }
    else {
      product._id = req.params.id;
      res.render('admin/modify', { product:product, errors:errors });
    }
  });

  // update
  router.put('/:id',function(req, res){
    Product.findOneAndUpdate({_id:req.params.id}, req.body, function(err, product){
      if(err){
        req.flash('product', req.body);
        req.flash('errors', util.parseError(err));
        return res.redirect('/products/'+req.params.id+'/edit');
      }
      res.redirect('/products/'+req.params.id);
    });
  });

  // destroy
  router.delete('/:id', function(req, res){
    Post.deleteOne({_id:req.params.id}, function(err){
      if(err) return res.json(err);
      res.redirect('/admin/shop');
    });
  });
module.exports = router;
