// util.js

var util = {};

util.parseError = function(errors){
  var parsed = {};
  if(errors.name == 'ValidationError'){
    for(var name in errors.errors){
      var validationError = errors.errors[name];
      parsed[name] = { message:validationError.message };
    }
  } 
  else if(errors.code == '11000' && errors.errmsg.indexOf('username') > 0) {
    parsed.username = { message:'This username already exists!' };
  } 
  else if(errors.code == '11000' && errors.errmsg.indexOf('email') > 0) {
    parsed.email= { message:'This email already exists!' };
  } 
  else {
    parsed.unhandled = JSON.stringify(errors);
  }
  console.log(errors);
  return parsed;
}

module.exports = util;