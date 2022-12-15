var createError = require('http-errors');
var express = require('express');
var ejs=require('ejs')
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var db=require('./Model/connectionmongo')
var expressLayouts=require('express-ejs-layouts')
var usersRouter = require('./routes/user');
var adminRouter = require('./routes/admin');
const bodyParser=require('body-parser');
const {check,validationResult}=require('express-validator');
const { fileURLToPath } = require('url');
const fileUpload = require('express-fileupload');

var app = express();

app.use(expressLayouts);
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
const urlencodedParser=bodyParser.urlencoded({extended:false})
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(fileUpload())

db.connect((err)=>{

  if(err) console.log("Connection error"+err);

  else console.log("Database connected to port 27017");
});

app.use('/', usersRouter);
app.use('/admin', adminRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
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
