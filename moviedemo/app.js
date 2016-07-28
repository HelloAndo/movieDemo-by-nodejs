var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser' );
var session = require('express-session');
var bodyParser = require('body-parser');


var mongoose = require('mongoose');
var mongoStore = require('connect-mongo')(session);
var port = process.env.PORT || 8888;//PORT=4000 node app
var app = express();



//设置模型为全局变量
global.Movie = require( './app/models/movie' );
global.User = require( './app/models/user' );
var dbUrl = 'mongodb://localhost/movie';
mongoose.connect(dbUrl);

// view engine setup 设定视图根目录以及默认模板引擎
app.set('views', path.join(__dirname, '/app/views/pages'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
//对表单数据进行格式化成对象 卧槽，就是你害我。。。两个小时你妹啊= = extended: false应该为true
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(session({
  //防止篡改cookie
  secret: 'movie',
  store: new mongoStore({
    url: dbUrl,
    //把session保存到mongodb的collection的sessions里
    collection: 'sessions'
  })
}));
//静态文件存放目录
app.use(express.static(path.join(__dirname, 'public')));
//动态视图助手，本地变量
app.locals.moment = require('moment');


app.use(function (req, res,next) {
  var _user = req.session.user;
  if(_user) {
      //动态视图助手,可以在应用程序提供的模板中访问本地变量。
      app.locals.user = _user;
    }
    return next();
})
require('./routes/routes')(app);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// if 开发环境will print stacktrace
// if ('development' === app.get('env')) {
//   //将错误信息打印到屏幕
//   app.set('showStackError', true);
//   //输出请求方式，路径以及状态码
//   app.use(logger(':method :url :status'));
//   //格式化错误信息
//   app.locals.pretty = true;
//   //设置数据库
//   mongoose.set('debug', true);
// }

if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


app.listen(port);

console.log('Movie satrt on port:' + port);

