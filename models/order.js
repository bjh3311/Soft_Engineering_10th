const mongoose=require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
  user: {type: Schema.Types.ObjectId, ref: 'User'}, // 유저랑 엮어놓은것.
  cart: {type: Object, required: true},
  address: {type: String, required: true},
  name: {type: String, required: true},
  paymentId: {type: String, required: true}
});

module.exports= mongoose.model('Order', schema);