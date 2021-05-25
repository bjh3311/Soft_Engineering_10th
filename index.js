var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var flash = require('connect-flash');
var session = require('express-session');
var passport = require('./config/passport');
var util = require('./util');
var app = express();
var moment = require('moment');
const MongoStore = require('connect-mongo');

//layouts
var expressLayouts = require('express-ejs-layouts');

app.use(expressLayouts);
//posts

app.use(express.urlencoded({extended:false}));
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
// DB setting
mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.set('useUnifiedTopology', true);

mongoose.set('autoIndex', true);

mongoose.connect('mongodb+srv://iqeq1945:sksmsdit12@cluster0.3rl9c.mongodb.net/test?retryWrites=true&w=majority');
var db = mongoose.connection;
db.once('open', function(){
  console.log('DB connected');
});
db.on('error', function(err){
  console.log('DB ERROR : ', err);
});


// setting
app.set('view engine','ejs'); // 1
app.use(express.static(__dirname + '/public'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
app.use(methodOverride('_method'));
app.use(flash()); // 2

app.use(session({
  secret:'MySecret',
  resave:false,
  saveUninitialized:true,
  store: MongoStore.create({
  mongoUrl : mongoose.connection._connectionString,
  ttl: 60 * 60
  }),
}));

// setting
app.set('view engine','ejs'); // 1
app.set('layout', './layout/full-width');
app.set("layout extractScripts",true);


// Passport

app.use(passport.initialize());
app.use(passport.session());

// Custom Middlewares
app.use(function(req,res,next){
  res.locals.isAuthenticated = req.isAuthenticated();
  res.locals.currentUser = req.user;
  res.locals.session = req.session;
  next();
});
// routes setting
// app.use('/', require('./routes/main'));
app.use('/', util.getProductQueryString, require('./routes/main'));
app.use('/admin', require('./routes/admin'));
app.use('/users', require('./routes/users'));
app.use('/products', require('./routes/products'));
app.use('/posts', require('./routes/posts'));


// port setting
var port = 3000;
app.listen(port, function(){
  console.log('server on! http://localhost:'+port);
});
