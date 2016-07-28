var _ = require('underscore');
// var mongoose = require('mongoose')
// var Movie = mongoose.model('Movie')
var Movie = require('../models/movie');
var Comment = require('../models/comment');
var Category = require('../models/category');


//Movie 后台录入页
exports.new = function(req,res) {
    Category.find({},function(err, categories) {
        res.render('admin', {
            title: 'Movie 后台录入页',
            categories: categories,
            movie: {}
        });
    })
	
};
//Moive 后台更新页
exports.update = function (req, res) {
    var id = req.params.id;

    if(id) {

        Movie.findById(id, function (err, movie) {
            Category.find({},function(err, categories) {
                res.render('admin', {
                    title: 'Moive 后台更新页',
                    movie: movie,
                    categories: categories
                })
            })
        });
    };
}
//删除
exports.delete = function (req,res) {
    var id =req.query.id;

    if(id) {
        Movie.remove({_id:id}, function (err,movie) {
            if(err) {
                console.log(err);
            } else {
                res.json({success: 1});
            }
        })
    }
};

//更新
exports.save = function (req, res) {
    //判断post数据是否是新加的,req.body为获取post数据

    var id = req.body.movie._id;
    var movieObj = req.body.movie;
    var categoryId = movieObj.category;
    var categoryName = movieObj.categoryName;
    var _movie;
    //id已经存在
    if(id) {
        Movie.findById(id, function (err,movie) {
            if (err) {
                console.log(err);
            }
            //用post过来的数据里面更新过的字段来替换掉老的电影数据
            //underscore里extend方法，另外一个对象新的字段替换掉老的对象的字段
            _movie = _.extend(movie, movieObj);
            //更新完毕保存数据
            _movie.save(function (err, movie) {
                if (err) {
                    console.log(err);
                }
                if(categoryId) {

                   
                    Category.findById(categoryId, function(err, category) {
                        console.log(category.movies);
                
                        category.movies.push(movie._id);
                        category.save(function (err, category) {
                            res.redirect('/movie/' + movie._id);
                        })
                    })
                } else if (categoryName) {
                    var category = new Category({
                        name: categoryName,
                        movies: [movie._id]
                    })

                    category.save(function(err, category) {
                        movie.category = category._id;
                        movie.save(function (err, movie) {
                            res.redirect('/movie/' + movie._id);
                        })
                    })
                }

            });
        })
    } else {
        //创建模型实例
        _movie = new Movie(movieObj);
        

        //创建完毕保存数据
        _movie.save(function (err, movie) {
            if (err) {
                console.log(err);
            }
            
            if(categoryId) {
                Category.findById(categoryId, function(err, category) {
                    category.movies.push(movie._id);
                    category.save(function (err, category) {
                        res.redirect('/movie/' + movie._id);
                    })
                })
            } else if (categoryName) {
                var category = new Category({
                    name: categoryName,
                    movies: [movie._id]
                })

                category.save(function(err, category) {
                    movie.category = category._id;
                    movie.save(function (err, movie) {
                        res.redirect('/movie/' + movie._id);
                    })
                })
            }
            
            
        });

    }
};
//详情
exports.detail = function(req,res) {
    /*
    Request.Params是所有post和get传过来的值的集合,
    Request.Form是取post传值, 
    Request.QueryString是get传过来的值
    */
    var id = req.params.id;
    console.log(id);
    Movie.update({_id:id}, {$inc: {pv: 1}}, function (err) {
        if (err) {
          console.log(err);  
        };
        
    })
    Movie.findById(id, function (err,movie) {
        // if(!movie) {
        //    return res.redirect('/');
        // }

        // //到Comment模型查找哪些comment的id是与当前页movie的id为同一个
        // Comment.find({movie: id}, function (err, comments) {
        //     //获取到的comments为数组
        //     console.log(comments);
        //     res.render('detail', {
        //         title: 'Movie 详情',
        //         movie: movie,
        //         comments: comments
        //     });
        // })
        Comment
            //通过当前页movieid找到comment中有此movie的数据
            .find({movie: id})
            //找到所有评论过此电影的数据后通过populate方法找到from里的ObjectId去
            //user表里面查询，返回name填充引用字段的内容
            .populate('from','name')
            //已逗号分隔，没逗号引起查询不了返回undefined不报错我擦，找了一下午
            .populate('reply.from reply.to','name')

            .exec(function(err,comments) {
                res.render('detail', {
                    title: 'Movie 详情',
                    movie: movie,
                    comments: comments
                })
            })
        
    })
};
//Movie 列表页
exports.list = function(req,res) {
    console.log(1);
    Movie.fetch(function (err, movies) {
        if(err) {
            console.log(err);
        }
        res.render('list', {
            title: 'Movie 列表页',
            movies: movies
        });
    })
};
