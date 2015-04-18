/**
 * Created by zhaofengmiao on 15/4/11.
 */
var nodejieba = require("nodejieba");
var mongoose = require("mongoose");
var async = require("async");


nodejieba.loadDict("../node_modules/nodejieba/dict/jieba.dict.utf8", "../node_modules/nodejieba/dict/hmm_model.utf8", "../node_modules/nodejieba/dict/user.dict.utf8");

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

var segsSchema = new Schema({
    title: String,
    titleSegs: String,
    body: {type: String, default: ''},
    bodySegs: {type: String, default: ''},
    url: {type: String, index: {unique: true}}
});

var News = mongoose.model('News', newsSchema);
var Segs = mongoose.model('Segs', segsSchema);


var result;
async.series([
    function(callback){
        // do some stuff ...
        News.find({}, "title date body url", function(error, docs){
            if (error) {
                console.log(error);
                done(error);
            }
            result = docs;
            callback(null, docs);
        });
    },
    function (callback) {

        async.eachSeries(result, function (item, next) {
            nodejieba.cut(item.title, function (wordList) {
                var tempSegs = {title: item.title, titleSegs: wordList, url: item.url};
                var segs = new Segs(tempSegs);

                Segs.find({url: item.url}, function (error, foundSegs) {
                    // 如果找不到则存储
                    if (!foundSegs[0]) {
                        segs.save(function (error) {
                            if(error){
                                console.error(error);
                            }
                            next();
                        });
                    } else {
                        next();
                    }
                })
            })
        }, callback);
    },
    function (callback) {

        async.eachSeries(result, function (item, next) {
            nodejieba.cut(removeHTMLTag(item.body), function (wordList) {
                var tempSegs = {body: removeHTMLTag(item.body), bodySegs: wordList, url: item.url};
                var segs = new Segs(tempSegs);

                Segs.findOneAndUpdate({url: item.url}, tempSegs, function (error, foundSegs) {
                    if (error) {
                        return next(error);
                    }
                    if (foundSegs == null) {
                        segs.save(next);
                    } else {
                        next();
                    }

                })
            })
        }, callback);
    }
], function (error) {
    if (error) {
        console.log(error);
    }
    console.log("segment completed!");
    process.exit(0);
});

/**
 * 去除字符串中的HTML标签和&nbsp;
 * @param string
 * @returns {*|string|void|XML}
 */
function removeHTMLTag(string) {
    string = string.replace(/<\/?[^>]*>/g, "");
    string=string.replace(/&nbsp;/ig,'');//去掉&nbsp;
    return string;
}