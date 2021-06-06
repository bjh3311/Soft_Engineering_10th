// 주문 내역 디비

var mongoose = require('mongoose');

// schema
var orderSchema = mongoose.Schema({
  payDate : {type : String, required : true}, // 구입 날짜
  orderNum : {type : String, required:true}, // 주문 번호
  user : {type : String, required : true}, // 구입한 유저 아이디
  cart : {type : Object, required : true}, // 구입한 물건들
  deliverName : {type : String, required : true}, //받는 사람 이름
  address : {type : String, required : true}, // 배송할 배송지
  contact : {type : String, required : true}, // 연락처
  message : {type : String}, // 배송 메세지
  flag : {type : String, default : '결제완료'}, // 주문 상태
});

// model & export
var Order = mongoose.model('order', orderSchema);
module.exports = Order;