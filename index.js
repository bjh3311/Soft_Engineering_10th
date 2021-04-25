var express = require('express');
var app = express();

app.set('view engine','ejs'); // 1
app.use(express.static(__dirname + '/public'));

app.get('/', function(req,res){ // 2
  res.render('index');
});


var port = 3000;
app.listen(port, function(){
  console.log('server on! http://localhost:'+port);
});
