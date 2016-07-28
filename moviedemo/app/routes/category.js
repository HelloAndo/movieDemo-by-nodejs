
var Category = require('../models/category');

//Movie 后台录入页
exports.new = function(req,res) {
	res.render('category_admin', {
		title: 'Movie 后台分类录入页',
        category: {}
    
	 });
};
    


//更新
exports.save = function (req, res) {
    //判断post数据是否是新加的,req.body为获取post数据

    var _category = req.body.category;
      //创建模型实例
    var category = new Category(_category)
    //创建完毕保存数据
    category.save(function (err, category) {
        if (err) {
            console.log(err);
        }
        res.redirect('/admin/category/list');
    });
}

exports.list = function(req,res) {
    Category.fetch(function (err, categories) {
        if(err) {
          console.log(err);
        }
        res.render('categorylist', {
          title: 'Movie 分类列表',
          categories: categories
        });
    })
};