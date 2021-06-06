var express = require('express');
var router = express.Router();
var Product = require('../models/Product');
var Review = require('../models/Review');
var multer = require('multer');
var util = require('../util');
var moment = require('moment');
var upload = multer({ dest: './public/upload' });
const Mongoose = require('mongoose');

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
  router.get('/:id', util.isLoggedin, checkPermission,  async function(req, res){
    var page = Math.max(1, parseInt(req.query.page));
  var limit = Math.max(1, parseInt(req.query.limit));
  page = !isNaN(page)?page:1;
  limit = !isNaN(limit)?limit:1;

  var skip = (page-1)*limit;
  var count = await Review.countDocuments({product:req.params.id});
  var sum = await Review.aggregate([
    { $match : { product : new Mongoose.Types.ObjectId(req.params.id) }},
    { $group : { _id: null, count : {$sum : "$star" }}}
  ])
  var maxPage = Math.ceil(count/limit);

  var product = await Product.findOne({_id:req.params.id})
    .exec();
  var review = await Review.find({product:req.params.id})
    .skip(skip)
    .limit(limit)
    .exec();

    if(sum[0]===undefined){
      var rating=0;
    }else{
      var rating=sum[0].count/count;
    }

    res.render('admin/detail',{
      product:product,
      review:review,
      currentPage:page,
      maxPage:maxPage,
      limit:limit,
      moment,
      sum:rating,
      count
    })
  });

  // edit
  router.get('/:id/edit', util.isLoggedin, checkPermission, function(req, res){
    var product = req.flash('product')[0];
    var errors = req.flash('errors')[0] || {};
    if(!product|| isEmptyArr(product.files)){
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
        query['files']=[];
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
