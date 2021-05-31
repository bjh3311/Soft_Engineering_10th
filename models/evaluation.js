// models/evaluation

var mongoose = require('mongoose');

// schema
var evaluationSchema = mongoose.Schema({ // 1
  user : { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  product : {type: mongoose.Schema.Types.ObjectId, ref: 'Product'},
  body:{type:String, required:[true, "Body is required!"], minlength:20, maxlength:100, trim:true},
  flag:{type:Boolean, default:0},
  start:{type: Date, required:[true, "Start date is required!"]},
  end:{type: Date, required:[true, "End date is required!"]},
  createdAt:{type:Date, default:Date.now}, 
});

// model & export
var Evaluation = mongoose.model('evaluation', evaluationSchema);
module.exports = Evaluation;