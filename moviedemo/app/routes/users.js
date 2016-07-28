// var mongoose = require('mongoose');
// var User = mongoose.model('User')
var User = require('../models/user');
exports.signup = function (req, res) {
	/**
	 * 根据提交方式的不同
	 * 通过路由拿到
	 * 1.'/user/signup/:userid'
	 * var _userid = req.params.userid;
	 * 通过query参数串拿到
	 * 2.'/user/signup/1111?userid=2222
	 * var _userid = req.query.userid
	 * 3. 如表单提交post，或者异步ajax提交是一个post data,data提交过来以后在body里面
	 * '/user/signup/1111?userid=2222  {userid:1113}
	 * 优先级：params首先从路由查找1111，之后body1113,之后query2222,要注意
	 * [ description]
	 * @type {[type]}
	 */
	var _user = req.body.user;
	
	User.findOne({name:_user.name}, function (err,user) {
		if (err) {
			console.log(err);
		}
		//需要优化
		if(user) {
			return res.redirect('/signin');
		} else {
			var user = new User(_user);

			user.save(function (err, user) {
				if (err) {
					console.log(err);
				} 
				res.redirect('/');
			})
		}
	})
};
/**
 * 除了进行密码比对之外还要把用户的登录状态保存起来
 * 最简单就是把状态存储到内存
 * 会话一般用来跟踪用户，比如某段时间内，一个用户多次访问一个网站，确定该用户的身份
 * 服务器与用户（一一对应）一个用户的所有请求都应该是同一个会话，每一个会话相互独立
 * 由于http未无状态协议，一旦交互完成连接就被关闭，再次交互就要再次建立连接，
 * 所以服务器无法从连接跟踪会话，所以要引入一种机制来弥补hhtp协议的不足
 * 一般用cookie+session来实现，cookie是通过在客户端记录信息来确定用户的身份，session通过服务器端记录信息
 * 
 * cookie:每一次http请求都会带给服务器当前域下的cookie值，服务器通过解析这些cookie
 * 值（或者加密过的）来辨识当前用户的信息，cookie数据都是存储到浏览器（客户端）键值对
 * （可以删除更改设置过期时间等等，也有一些存储容量的限制）
 * 
 * 当程序需要为某个客户端的请求创建一个session的时候，服务器首先检查这个客户端的请求
 * 里面是否包含了session的标识（sessionid）,如果已经有，则是以前已经创建。
 * 那么服务器就根据sessionid把session找出来。如果没有则为这个客户端创建一个session并且
 * 生成一个跟这个session关联的sessionid.而且这个seesionid的值是一个不会重复并且
 * 不容易找到规律的字符串从而防止被伪造，这个sessionid就在当次这个请求中返回给客户端保存起来
 *
 * 保存这个sessionid的方式可以采用cookie，这样在交互的过程中浏览器可以自动按照规则把这个
 * 标识（sessionid）发送给服务器，cookie名字一类似于.sid.一般情况下sessionid都是存储到内存，当服务器停止或者重启
 * 服务器中的sessionid会被清空，如果设置了session的持久化的特性（把session保存至硬盘），当重启
 * 这些信息就能再次被使用
 *
 * session持久化方式：1.基于cookie的方式(把数据直接存储到cookie里，解析以后即可获取) 
 * 2.基于内存的方式（使用内存当做容器来存储数据）
 * 以及redis（把数据存到redis数据库，这样不同进程都可获取session数据，
 * cookie解析后获取sessionid，通过sessionid从redis获取相应数据）
 * 和mongodb（与redis同理）
 * 
 * cookie.connect.sid => cookieParser解析=sessionid =》（保存到）req.sessionid=>
 * 当通过session中间件的时候首先要通过store对象来读取session的数据
 *
 */
exports.signin = function (req,res) {
	var _user = req.body.user,
			name = _user.name,
			password = _user.password;

	User.findOne({name: name}, function (err,user) {
		if (err) {
			console.log(err);
		}
		//需要优化
		if (!user) {
			return res.redirect('/signup');
		}

		user.comparePassword(password, function (err, isMatch) {
			if (err) {
				console.log(err);
			}
			if(isMatch) {
				//session为会话状态,首先把匹配成功的user先保存到session里面，
				//后面就可以根据session里面是不是user来进行判断
				req.session.user = user;
				return res.redirect('/');
			} else {
				return res.redirect('/signin');
				console.log('Password is not matched')
			}
		})
	})
};

exports.logout = function (req,res) {
	delete req.session.user;
	//删除本地变量
	//delete app.locals.user;
	res.redirect('/');
};


exports.list = function(req,res) {
  global.User.fetch(function (err, users) {
      if(err) {
          console.log(err);
      }
      res.render('userlist', {
          title: 'Movie 用户列表',
          users: users
      });
  })
};


exports.showSignup = function(req,res) {
  res.render('signup', {
      title: '注册'
  });
};

exports.showSignin = function(req,res) {
  res.render('signin', {
      title: '登录'
  });
};

exports.signinRequired = function(req, res, next) {
  var user = req.session.user;
  if (!user) {
    return res.redirect('/signin')
  }

  next();
}

exports.adminRequired = function(req, res, next) {
  var user = req.session.user;
  console.log(user);
  //修改权限后要登出再登入才可以刷新role
  if (user.role <= 10) {
    return res.redirect('/signin')
  }

  next();
}
