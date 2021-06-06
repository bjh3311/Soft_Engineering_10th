// 배송지 스키마
const mongoose=require('mongoose');
const Schema = mongoose.Schema;

const destinationSchema = new Schema({
  user: {type: String, required : true}, // 유저랑 엮어놓은것.
  name : {type : String, required : [true, "배송지 이름을 입력해주세요"]}, // 배송지 이름
  post : {
    type : Number, 
    required : [true, "우편번호를 입력해주세요"],
  }, // 우편 번호
  roadAddress : {
    type : String, 
    required : [true, "도로명 주소를 입력해주세요"],
    match : [/(([가-힣A-Za-z·\d~\-\.]{2,}(로|길).[\d]+)|([가-힣A-Za-z·\d~\-\.]+(읍|동)\s)[\d]+)/, '잘못된 주소입니다']
  }, // 도로명 주소
  detailAddress : {type : String, required : [true, "상세주소를 입력해주세요"]},// 상세 주소
  contact : {
    type : String,
    required : [true, "연락처를 입력해주세요"],
    match : [/^\d{3}-\d{3,4}-\d{4}$/, '잘못된 연락처입니다']
  }, // 연락처
});

const Destination = mongoose.model('destination', destinationSchema);
module.exports = Destination;