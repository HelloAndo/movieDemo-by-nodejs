var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.Types.ObjectId;

var MovieSchema = new Schema({
	title: String,
	director: String,
	language: String,
	country: String,
	summary: String,
	flash: String,
	poster: String,
	year: String,
	pv: {
		type: Number,
		default: 0
	},
	category: {
		type: ObjectId,
		ref: 'Category'
	},
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
MovieSchema.pre('save', function (next) {
	//判断数据是否是新加的
	if(this.isNew) {
		this.meta.createTime = this.meta.update = Date.now();
	} else {
		this.meta,updateTime = Date.now()
	}

	next();
})
//只有进行模型编译实例化以后才能有这些方法
MovieSchema.statics = {
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
module.exports = MovieSchema;