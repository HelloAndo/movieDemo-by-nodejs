//添加多个路由记录，所以便于管理和访问.存放添加的文件
module.exports = function ( app ) {
		app.use(function (req, res,next) {
		  var _user = req.session.user;
		  //动态视图助手,可以在应用程序提供的模板中访问本地变量。
		  app.locals.user = _user;
		  return next();
		})
		
    require('./controllers/Homepage')(app);
    require('./controllers/movie')(app);
    require('./controllers/users')(app);
};