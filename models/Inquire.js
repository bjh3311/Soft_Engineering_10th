// models/inquire

var mongoose = require('mongoose');

// schema
var inquireSchema = mongoose.Schema({ // 1
  order : {type : mongoose.Schema.Types.ObjectId, ref : 'order'},
  user : { type: String , required:true},
  product : {type: mongoose.Schema.Types.ObjectId, ref: 'Product' , required:true},
  recommend:{type:String, required:[true, "추천은 필수입니다."]},
  title:{type:String, required:[true, "제목은 필수입니다."]},
  body:{type:String, required:[true, "후기는 필수입니다."]},
  flag:{tpye:Boolean, default:0},
  createdAt:{type:Date, default:Date.now}, 
});

// model & export
var Inquire = mongoose.model('inquire', inquireSchema);
module.exports = Inquire;