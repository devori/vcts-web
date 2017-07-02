var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var bodyParser = require('body-parser');
var session = require('express-session');
var uuid = require('uuid/v4');

var publicRouter = require('./routes/public');
var privateRouter = require('./routes/private');

var app = express();
app.set('trust proxy', 1);
// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(session({
  secret: uuid(),
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false }
}));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
  if (req.path.startsWith('/public') || req.session.username) {
    next();
    return;
  }
  res.status(401).json({
    status: 'failure',
    result: 'Unauthenticated'
  });
});

app.use('/public', publicRouter);
app.use('/private', privateRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  res.status(404).json({
    status: 'failure',
    result: 'Not Found'
  });
});

// error handler
app.use(function(err, req, res, next) {
  res.status(err.status || 500).json({
    status: 'failure',
    result: err.result
  });
});

module.exports = app;
