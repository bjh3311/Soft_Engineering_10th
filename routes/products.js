var express = require('express');
var router = express.Router();
var Product = require('../models/Product');
var multer = require('multer');
var util = require('../util');

var upload = multer({ dest: './public/upload' });


  //create
router.post('/', upload.array('attachments',3), function(req, res){
    var query =req.body;
    query['files'] = req.files;
    query['img'] = req.files[0].filename;
    Product.create(query, function(err, product){
      if(err){
        req.flash('producuts', req.query);
        req.flash('errors', util.parseError_(err));
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
  router.put('/:id', upload.array('attachments',3),function(req, res){
    var query =req.body;
    if(typeof req.files != "undefined"){
          query['files'] = req.files;
          query['img'] = req.files[0].filename; 
    }
    
    Product.findOneAndUpdate({_id:req.params.id}, query,{runValidators: true }, function(err, product){
      if(err){
        req.flash('product', query);
        req.flash('errors', util.parseError_(err));
        return res.redirect('/products/'+req.params.id+'/edit');
      }
      res.redirect('/products/'+req.params.id);
    });
  });

  router.put('/:id/flag',function(req, res){
    Product.findOneAndUpdate({_id:req.params.id}, {flag:false}, function(err, product){
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
