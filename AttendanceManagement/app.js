var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var index = require('./routes/index');
var users = require('./routes/user');
var add=require('./routes/add');
var admin=require('./routes/admin');
var teacher=require('./routes/teacher');
var student=require('./routes/student');


var app = express();
var exhbs=require('express-handlebars');
var session=require('express-session');
var mongoose=require('mongoose');

var flash=require('connect-flash');
var validator=require('express-validator');


var passport=require('passport');
var MongoStore=require('connect-mongo')(session);
mongoose.connect('localhost:27017/attendance');

require('./config/passport');

// view engine setup
app.engine('.hbs',exhbs({
    defaultLayout:'layout',
    extname:'.hbs'
})
);
app.set('view engine','.hbs');
// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(validator());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
    secret:'keyboardcat',
    resave:false,
    saveUninitialized:false,
    store:new MongoStore({mongooseConnection:mongoose.connection})
})  
);
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

app.use(function (req,res,next) {
//setting up a global variable which is available in views using locals object on response and add login property to it
    //res.locals is An object that contains response local variables scoped to the request, and therefore available only to the view(s) rendered during that request / response cycle (if any). Otherwise, this property is identical to app.locals.This property is useful for exposing request-level information such as the request path name, authenticated user, user settings, and so on.
    res.locals.login=req.isAuthenticated();

    //console.log(req.isAuthenticated());
    next();
});
app.use('/add',add);
app.use('/admin', admin);
app.use('/teacher', teacher);
app.use('/student',student);
app.use('/user', users);
app.use('/', index);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
