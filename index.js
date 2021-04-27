var express = require('express');
var mongoose = require('mongoose');
var methodOverride = require('method-override');
var flash = require('connect-flash'); 
var session = require('express-session'); 
var passport = require('./config/passport');
var app = express();


// DB setting
mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.set('useUnifiedTopology', true);
mongoose.connect('mongodb+srv://iqeq1945:sksmsdit12@cluster0.3rl9c.mongodb.net/test?retryWrites=true&w=majority');
var db = mongoose.connection;
db.once('open', function(){
  console.log('DB connected');
});
db.on('error', function(err){
  console.log('DB ERROR : ', err);
});

// Passport 
app.use(passport.initialize());
app.use(passport.session());

// Custom Middlewares
app.use(function(req,res,next){
  res.locals.isAuthenticated = req.isAuthenticated();
  res.locals.currentUser = req.user;
  next();
});

// setting
app.set('view engine','ejs'); // 1
app.use(express.static(__dirname + '/public'));
app.use(methodOverride('_method'));
app.use(flash()); // 2
app.use(session({secret:'MySecret', resave:true, saveUninitialized:true}));


// routes setting
app.get('/', function(req,res){ // 2
  res.render('index');
});


// port setting
var port = 3000;
app.listen(port, function(){
  console.log('server on! http://localhost:'+port);
});
