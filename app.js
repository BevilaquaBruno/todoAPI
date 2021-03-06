const compression = require('compression');
const express= require('express');
const app = express();
const port = 3000;

var helmet = require('helmet');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var httpErrors = require('http-errors');
var mongoose = require('mongoose');

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authentication");
  next();
});

var todoRouter = require('./routes/todo');
var authorRouter = require('./routes/author');
var secureRouter = require('./routes/secure');

var mongoDB = 'mongodb://localhost/todosAPP';

mongoose.connect(mongoDB, { useNewUrlParser: true });
mongoose.Promise = global.Promise;
mongoose.connection.on('error', console.error.bind(console, 'MongoDB connection error:'));

app.use(helmet());

app.use(logger('dev'));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(cookieParser());

app.use(compression());

app.use('/todo', todoRouter);
app.use('/author', authorRouter);
app.use('/secure', secureRouter);
app.use('*', function (req, res, next) {
  res.json({ error: true, msg: 'Invalid route.' });
});

app.use(function (req,res,next) {
  next(httpErrors(404));
});

module.exports = app
