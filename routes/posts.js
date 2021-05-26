var express = require('express');
var router = express.Router();
var Post = require('../models/Post');
var multer = require('multer');
var util = require('../util');
var path = require('path');
var moment = require('moment');

var storage  = multer.diskStorage({ // 2
    destination(req, file, cb) {
      cb(null, './public/posts');

    },
    filename(req, file, cb) {
      cb(null, req.body.title+'-'+file.originalname);
    },
  });

  var uploadWithOriginalFilename = multer({ storage: storage });


  //create
router.post('/',util.isLoggedin, checkPermission, uploadWithOriginalFilename.single('attachment'), function(req, res){
  var query = req.body;
  if(typeof req.file!="undefined"){
    query['file']={
      name : req.file.filename,
      original : req.file.originalname
    }
  }
  Post.create(query, function(err, post){
      if(err){
        req.flash('posts', req.body);
        req.flash('errors', util.parseError_(err));
        return res.redirect('/admin/form_create');
      }
      res.redirect('/admin/table');
    });
  });

  // show
  router.get('/:id', util.isLoggedin, checkPermission, function(req, res){
    Post.findOne({_id:req.params.id})
      .exec(function(err, post){
        if(err) return res.json(err);

        res.render('admin/table_detail', {post:post});
      });
  });


  // edit
  router.get('/:id/edit',util.isLoggedin, checkPermission, function(req, res){
    var post = req.flash('post')[0];
    var errors = req.flash('errors')[0] || {};
    if(!post){
      Post.findOne({_id:req.params.id}, function(err, post){
          if(err) return res.json(err);

          res.render('admin/form_update', { post:post, errors:errors, moment });

        });
    }
    else {
      post._id = req.params.id;

      res.render('admin/form_update', { post:post, errors:errors, moment });
    }
  });


  // update
  router.put('/:id',util.isLoggedin, checkPermission,uploadWithOriginalFilename.single('attachment'),function(req, res){
    var query = req.body;
    if(typeof req.file!="undefined"){
      query['file']={
        name : req.file.filename,
        original : req.file.originalname
      }
    }
    Post.findOneAndUpdate({_id:req.params.id}, query,{runValidators: true }, function(err, post){
      if(err){
        req.flash('post', query);
        req.flash('errors', util.parseError_(err));
        return res.redirect('/posts/'+req.params.id+'/edit');
      }

      res.redirect('/admin/table');
    });
  });
  router.put('/:id/flag',util.isLoggedin, checkPermission, function(req, res){
    Post.findOneAndUpdate({_id:req.params.id}, {flag:req.body.flag}, function(err, post){
      if(err){
        req.flash('post', req.body);
        req.flash('errors', util.parseError_(err));
        return res.redirect('/admin/table');
      }
      res.redirect('/admin/table');
    });
  });

  router.get('/:id/destroy',util.isLoggedin, checkPermission, function(req, res){
    var post = req.flash('post')[0];
    var errors = req.flash('errors')[0] || {};
    if(!post){
      Post.findOne({_id:req.params.id}, function(err, post){
          if(err) return res.json(err);
          res.render('admin/table_delete', { post:post, errors:errors });
        });
    }
    else {
      post._id = req.params.id;
      res.render('admin/table_delete', { post:post, errors:errors });
    }
  });

  // destroy
  router.delete('/:id', util.isLoggedin, checkPermission,function(req, res){
    Post.deleteOne({_id:req.params.id}, function(err){
      if(err) return res.json(err);

      res.send("<script>opener.parent.location.reload();window.close();</script > ")
    });
  });
module.exports = router;

function checkPermission(req, res, next){
  if(req.user.right == false) return util.noPermission(req,res);
  next();
}