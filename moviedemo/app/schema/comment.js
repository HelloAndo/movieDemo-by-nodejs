var mongoose = require('mongoose');
//通过引用方式存取电影id
var Schema = mongoose.Schema;
//每个Schema都会默认配置这个属性，属性名就是_id，除非自己定义才能覆盖
//同时默认索引是利用主键（ObjectId）来索引
var ObjectId = Schema.Types.ObjectId;
/**
 * 由于mongodb文档型数据库非关系型，无法用用joins特性,因此mongoose封装了一个
 * population的功能。
 * 即定义Schema的时候指定某一个字段是引用（ref）另外的一个Schema,那么在获取document
 * 的时候就可以通过populate的方法让mongoose帮你通过引用Schema的id找到关联的文档
 * 然后用这个文档的内容替换掉引用字段的内容
 * populate方法可以用在文档上，模型上和query对象上
 * .populate(path, [select], [model], [match], [options])
 * path(指定要填充的关联字段,多个关联字段可以以空格分隔)
 * select(可选，指定填充 document 中的哪些字段。)
 * model(可选,指定关联字段的 model，如果没有指定就会使用Schema的ref。)
 * match(可选，指定附加的查询条件。)
 * options(可选，指定附加的其他查询选项，如排序以及条数限制等等。)
 */



var CommentSchema = new Schema({
	/**
	 * 1.评论人 2.当前页面 3.回复给谁 4.评论具体内容
	 */
	movie: {
		type: ObjectId,
		//指向Movie模型
		ref: 'Movie'
	},
	from: {
		type: ObjectId,
		ref: 'User'
	},
	//存放主评论下面的小评论
	reply:[{
		from: {
			type: ObjectId,
			ref: 'User'
		},
		to: {
			type: ObjectId,
			ref: 'User'
		},
		content: String
	}],
	
	content: String,
	meta: {
		createTime: {
			type: Date,
			default:Date.now()
		},
		updateTime: {
			type: Date,
			default:Date.now()
		}
	}
})
//每次存储数据之前都会去调用这个方法
CommentSchema.pre('save', function (next) {
	//判断数据是否是新加的
	if(this.isNew) {
		this.meta.createTime = this.meta.update = Date.now();
	} else {
		this.meta,updateTime = Date.now()
	}

	next();
})
//只有进行模型编译实例化以后才能有这些方法
CommentSchema.statics = {
	//用来去除数据库里所有数据
	fetch: function(cb) {
		return this
			.find({})
			.sort('meta.updateTime') //按照更新时间排序
			.exec(cb) 	//执行回调方法
	},
	//用来查询单条数据
	findById: function(id, cb) {
		return this
			.findOne({_id:id})
			.exec(cb) 	//执行回调方法
	}
}
module.exports = CommentSchema;