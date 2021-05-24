// models/Post.js

var mongoose = require('mongoose');

// schema
var postSchema = mongoose.Schema({ // 1
  title:{type:String, required:[true, "Title is required!"]},
  body:{type:String, required:[true, "Body is required!"]},
  flag:{type:Boolean, default:0},
  start:{type: Date, required:[true, "Start date is required!"]},
  end:{type: Date, required:[true, "End date is required!"]},
  createdAt:{type:Date, default:Date.now}, // 2
});

// model & export
var Post = mongoose.model('post', postSchema);
module.exports = Post;