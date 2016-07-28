var Comment = require('../models/comment');

// 评论
exports.save = function (req, res) {
    //获取评论字段
    var _comment = req.body.comment;

    //取出评论页面movieId
    var movieId = _comment.movie;
    if (_comment.cid) {
        console.log("_comment.cid:"+_comment.cid);
        Comment.findById(_comment.cid, function (err,comment) {
            var reply = {
                from: _comment.from,
                to : _comment.tid,
                content: _comment.content
            }
            console.log("replyto:"+reply.to+"_"+"replyfrom:"+reply.from);
            console.log("comment:"+comment)
            comment.reply.push(reply);
            console.log(comment);
            comment.save(function(err, comment) {
                console.log(comment);
                if (err) {
                    console.log("here+wrong");
                    console.log(err)
                }
                console.log(comment);
                res.redirect('/movie/' + movieId);
            })
        })
    } else {
        //创建模型实例
        var comment = new Comment(_comment);
        console.log("33:"+comment);
        //创建完毕保存数据
        comment.save(function (err, comment) {
            if (err) {
                console.log("comment.js"+15);
                console.log(err);
            }
            res.redirect('/movie/' + movieId);
        });  
    }
}



