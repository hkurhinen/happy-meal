var path = require('path');
var express = require('express');
var pug = require('pug');
var conf = require('./config');
var fs = require('fs');
var mongoose = require('mongoose');
var passport = require('passport');
var expressSession = require('express-session');
var auth = require('./auth');
var flash = require('connect-flash');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var clientTemplates = fs.readdirSync(__dirname + '/views/client');
var compiledClientTemplates = [];
for (var i = 0; i < clientTemplates.length; i++) {
  var templateName = clientTemplates[i].replace('.pug', '');
  templateName = 'render'+templateName[0].toUpperCase() + templateName.substring(1);
  compiledClientTemplates.push(pug.compileFileClient(
    __dirname + '/views/client/' + clientTemplates[i],
    { name: templateName}
  ));
}
fs.writeFileSync(__dirname + '/public/js/templates.js', compiledClientTemplates.join(''));

mongoose.connect('mongodb://localhost/happymeal');

var app = express();

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(expressSession({ secret: conf.sessionSecret }));
app.use(cookieParser());
app.use(bodyParser());
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

app.locals.sprintf = require('sprintf').sprintf;

auth.initPassport(passport);

var http = require('http').Server(app);
var io = require('socket.io')(http);

require('./routes')(app, io, passport);

http.listen(conf.port, function(){
  console.log('listening on *:'+conf.port);
});