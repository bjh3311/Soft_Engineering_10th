// model/Product.js

var mongoose = require('mongoose');


// schema 상품 [이름/가격/제조사/맛/중량/원산지/판매량/재고]
var productSchema = mongoose.Schema({
  name:{type:String, required:[true, 'Name is required!'], trim:true},
  price:{type:Number, required:[true, 'Price is required!'], trim:true},
  manufacturer:{type:String},
  body:{type: String, required:[true, 'Body is required!'],trim:true},
  taste:{type:String},
  weight:{type:String, required:[true, 'Weight is reqired!'],trim:true},
  origin:{type:String, required:[true, 'Origin is required!']},
  sales:{type:Number, default:0, min:0},
  stock:{type:Number, default:1000, min:0},
  flag:{type:Boolean, default: true},
  createAt:{type: Date, default: Date.now},
  img : {type:String},
  files:{type:[Array],required:[true, 'files are reqired!']}
});

// model & export
var Product = mongoose.model('product',productSchema);
module.exports = Product;
