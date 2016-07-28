// var mongoose = require('mongoose')
// var Movie = mongoose.model('Movie')
var Movie = require('../models/movie');
var Category = require('../models/category');
//处理get请求
exports.Homepage = function(req,res) {
    console.log('user in session');
    console.log(req.session.user);
    
    Category
        .find({})
        .populate({path: 'movies', options: {limit: 6}})
        .exec(function (err,categories) {
            if(err) {
                console.log(err);
            }
            res.render('Homepage', {
                title: 'Movie 首页',
                categories: categories
            })
        })
};

exports.search = function(req, res) {
  var catId = req.query.cat
  var q = req.query.q
  var page = parseInt(req.query.p, 10) || 0
  const count = 6
  var index = page * count

  if (catId) {
    Category
      .find({_id: catId})
      .populate({
        path: 'movies'
      })
      .exec(function(err, categories) {
        if (err) {
          console.log(err)
        }
        var category = categories[0] || {}
        var movies = category.movies || []
        var results = movies.slice(index, index + count)
        res.render('results', {
          title: 'Movie 结果列表页面',
          keyword: category.name,
          currentPage: (page + 1),
          query: 'cat=' + catId,
          totalPage: Math.ceil(movies.length / count),
          movies: results
        })
      })
  }
  else {
    Movie
      .find({title: new RegExp(q + '.*', 'i')})
      .exec(function(err, movies) {
        if (err) {
          console.log(err)
        }
        var results = movies.slice(index, index + count)

        res.render('results', {
          title: 'Movie 结果列表页面',
          keyword: q,
          currentPage: (page + 1),
          query: 'q=' + q,
          totalPage: Math.ceil(movies.length / count),
          movies: results
        })
      })
  }
}
