// models/Post.js

var mongoose = require('mongoose');

// schema
var postSchema = mongoose.Schema({ // 1
  title:{type:String, required:[true, "Title is required!"] ,trim:true},
  body:{type:String, required:[true, "Body is required!"], trim:true},
  flag:{type:Boolean, default:0},
  start:{type: Date, required:[true, "Start date is required!"]},
  end:{type: Date, required:[true, "End date is required!"]},
  createdAt:{type:Date, default:Date.now}, 
  file:{
    name : {type:String},
    original : {type:String}
  }
});

// model & export
var Post = mongoose.model('post', postSchema);
module.exports = Post;