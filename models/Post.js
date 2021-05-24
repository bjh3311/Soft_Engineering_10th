// models/Post.js

var mongoose = require('mongoose');

// schema
var postSchema = mongoose.Schema({ // 1
  title:{type:String, required:true},
  body:{type:String, required:true},
  flag:{type:Boolean, default:0},
  start:{type: Date},
  end:{type: Date},
  createdAt:{type:Date, default:Date.now}, // 2
  updatedAt:{type:Date},
});

// model & export
var Post = mongoose.model('post', postSchema);
module.exports = Post;