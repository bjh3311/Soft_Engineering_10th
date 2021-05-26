var express = require('express');
var router = express.Router();
var Product = require('../models/Product');
var multer = require('multer');
var util = require('../util');

var upload = multer({ dest: './public/upload' });


  //create
router.post('/', util.isLoggedin, checkPermission ,upload.array('attachments',3), function(req, res){
    var query =req.body;
    if(!isEmptyArr(req.files)){
      query['files'] = req.files;
      query['img'] = req.files[0].filename; 
    }else{
      req.flash('producuts', req.query);
      req.flash('files', {error: "files are required!"})
      return res.redirect('/admin/register');
    }
    Product.create(query, function(err, product){
      if(err){
        req.flash('producuts', req.query);
        req.flash('errors', util.parseError_(err))
        return res.redirect('/admin/register');
      }
      res.redirect('/admin/shop');
    });
  });

  // show
  router.get('/:id', util.isLoggedin, checkPermission,  function(req, res){
    Product.findOne({_id:req.params.id})
      .exec(function(err, product){
        if(err) return res.json(err);
        res.render('admin/detail', {product:product});
      });
  });

  // edit
  router.get('/:id/edit', util.isLoggedin, checkPermission, function(req, res){
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
  router.put('/:id',util.isLoggedin, checkPermission,  upload.array('attachments',3),function(req, res){
    var query =req.body;
    if(!isEmptyArr(req.files)){
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

  router.put('/:id/flag',util.isLoggedin, checkPermission, function(req, res){
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
  router.delete('/:id', util.isLoggedin, checkPermission, function(req, res){
    Post.deleteOne({_id:req.params.id}, function(err){
      if(err) return res.json(err);
      res.redirect('/admin/shop');
    });
  });
module.exports = router;

function checkPermission(req, res, next){
  if(req.user.right == false) return util.noPermission(req,res);
  next();
}
function isEmptyArr(arr)  {
  if(Array.isArray(arr) && arr.length === 0)  {
    return true;
  }
  
  return false;
}