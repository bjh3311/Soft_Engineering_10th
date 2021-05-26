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
  return parsed;
}


util.parseError_ = function(errors){
  var parsed = {};
  if(errors.name == 'ValidationError'){
    for(var name in errors.errors){
      var validationError = errors.errors[name];
      parsed[name] = { message:validationError.message };
    }
  }
  parsed.unhandled = JSON.stringify(errors);
  return parsed;
}

util.isLoggedin = function(req, res, next){
  if(req.isAuthenticated()){
    next();
  }
  else {
    req.flash('errors', {login:'Please login first'});
    res.redirect('/');
  }
}

util.noPermission = function(req, res){
  req.flash('errors', {login:"You don't have permission"});
  req.logout();
  res.redirect('/');
}

util.getProductQueryString = function(req, res, next){
  res.locals.getProductQueryString = function(isAppended=false, overwrites={}){
    var queryString = '';
    var queryArray = [];
    var origin = overwrites.origin?overwrites.origin:(req.query.origin?req.query.origin:'');
    var page = overwrites.page?overwrites.page:(req.query.page?req.query.page:'');
    var limit = overwrites.limit?overwrites.limit:(req.query.limit?req.query.limit:'');
    //var searchType = overwrites.searchType?overwrites.searchType:(req.query.searchType?req.query.searchType:'');
    var searchText = overwrites.searchText?overwrites.searchText:(req.query.searchText?req.query.searchText:'');
    var amount_start = overwrites.amount_start?overwrites.amount_start:(req.query.amount_start?req.query.amount_start:'');
    var amount_end = overwrites.amount_end?overwrites.amount_end:(req.query.amount_end?req.query.amount_end:'');
    var sort = overwrites.sort?overwrites.sort:(req.query.sort?req.query.sort:'');

    if(origin) queryArray.push('origin='+origin);
    if(page) queryArray.push('page='+page);
    if(limit) queryArray.push('limit='+limit);
    //if(searchType) queryArray.push('searchType='+searchType);
    if(amount_start) queryArray.push('amount_start='+amount_start);
    if(amount_end) queryArray.push('amount_end='+amount_end);
    if(sort) queryArray.push('sort='+sort);
    if(searchText) queryArray.push('searchText='+searchText);

    if(queryArray.length>0) queryString = (isAppended?'&':'?') + queryArray.join('&');
    return queryString;
  }
  next();
}
module.exports = util;
