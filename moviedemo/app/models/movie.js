var mongoose = require('mongoose');
var MovieSchema = require('../schema/movie');
/**
 * [Movie description] 编译生成movie模型
 * @type {[type]} 第一个参数为这个模型的名字，第二个参数为模型骨架
 */
var Movie = mongoose.model('Movie', MovieSchema);

module.exports = Movie;