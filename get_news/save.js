/**
 * Created by walter on 15-4-1.
 */

var mongoose = require('mongoose');
var async = require('async');

mongoose.connect('mongodb://localhost/xjtu');

var Schema = mongoose.Schema;
var newsSchema = new Schema({
    source: { type: String, default: '' },
    title:  String,
    author: { type: String, default: '' },
    body:   { type: String, default: '' },
    url:    { type: String, index: { unique: true } },
    date:   { type: Date, default: Date.now },
    tags:   { type: [String], default: [] }
});

var News = mongoose.model('News', newsSchema);

/**
 * 保存文章列表
 *
 * @param {Array} list
 * @param {Function} callback
 */
exports.saveArticleList = function (list, callback) {
    async.eachSeries(list, function (item, next) {

        var listItem = new News(item);

        News.findOneAndUpdate({ url: item.url }, item, function(error, foundNews) {
            if (error) return next(error);

            if (foundNews == null) {
                listItem.save(next);
            } else {
                next();
            }
        });

    }, callback);
};

//vadv = {
//    //source: '教务处',
//    title: 'news test!',
//    //author: '网络中心',
//    //body: '',
//    url: '/fsd/qrew-we-wefe111.html',
//    date: '2012-05-12'
//    //tags: []
//};
//
//var news1 = new News(vadv);
//
//news1.save(function(error, result) {
//    if (error) return console.error(error);
//    console.log(result);
//    //mongoose.disconnect();
//
//});
//
//vadv.title = 'jvhadlkfjgvkajldfgkjda';
//
//News.findOneAndUpdate({ url: '/fsd/qrew-we-wefe111.html' }, vadv, function(error, foundNews) {
//    if (error) return next(error);
//    console.log(foundNews);
//    mongoose.disconnect();
//});
