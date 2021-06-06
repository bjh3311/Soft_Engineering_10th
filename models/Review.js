// models/review

var mongoose = require('mongoose');

// schema
var reviewSchema = mongoose.Schema({ // 1
  user : { type: String , required:true},
  orderNum : {type : String, required:true},
  product : {type: mongoose.Schema.Types.ObjectId, ref: 'Product' , required:true},
  recommend:{type:String, required:[true, "추천은 필수입니다."]},
  delivery:{type:String, required:[true, "배송평가는 필수입니다."]},
  body:{type:String, required:[true, "후기는 필수입니다."], minlength:10, maxlength:100},
  star:{type:Number,required:[true,"별점은 필수입니다."]},
  createdAt:{type:Date, default:Date.now}, 
});

// model & export
var Review = mongoose.model('review', reviewSchema);
module.exports = Review;