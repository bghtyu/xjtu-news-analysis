/**
 * Created by zhaofengmiao on 15/4/11.
 */
var nodejieba = require("nodejieba");
var mongoose = require("mongoose");
var async = require("async");
var filter = require("./filter");
var tools = require("./tools");


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
    url: {type: String, index: {unique: true}},
    tags: { type: [String], default: [] }
});

var News = mongoose.model('News', newsSchema);
var Segs = mongoose.model('Segs', segsSchema);


var result_news;

async.series([
    function(callback){
        News.find({}, "title date body url", function(error, docs){
            if (error) {
                console.log(error);
                done(error);
            }
            result_news = docs;

            console.log("news data received!");

            callback(null);
        });
    },
    function (callback) {
        async.eachSeries(result_news, function (item, next) {
            async.series([
                function (callback) {
                    filter.collegeFilter(item.title, callback);
                },
                function (callback) {
                    filter.courseFilter(item.title, callback);
                }
            ], function (callback, result) {
                    var len,
                        k,
                        cutDst,
                        replaceString,
                        target;
                    var tags = [],
                        targets = [];

                    len = result.length;
                    for (k = 0; k < len; k ++) {
                        replaceString = result[k].content ? result[k].replaceString : null;
                        target = result[k].content ? result[k].target : null;

                        if (replaceString && target) {
                            tags.push(replaceString); // tags中保存\u0001,\u0002等
                            targets.push(target);
                        }
                    }

                    len = tags.length;
                    cutDst = item.title;
                    for (k = 0; k < len; k++) {
                        cutDst = cutDst.replace(targets[k], tags[k]);
                    }

                    //console.log(cutDst);

                    nodejieba.cut(cutDst, function (wordList) {
                        var k;
                        for (k = 0; k < tags.length; k++) {
                            for (var i = 0; i < wordList.length; i++) {
                                wordList[i] = wordList[i].replace(tags[k], targets[k]);
                            }
                        }
                        var tempSegs = {title: item.title, titleSegs: wordList, url: item.url, tags: tags};
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
                }
            );

        }, function () {
            console.log("cut TITLE was saved successfully!");
            callback(null);
        });
    },
    function (callback) {

        async.eachSeries(result_news, function (item, next) {
            nodejieba.cut(tools.removeHTMLTag(item.body), function (wordList) {
                var tempSegs = {body: tools.removeHTMLTag(item.body), bodySegs: wordList, url: item.url};
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

                });
            })
        }, function () {

            console.log("cut BODY was saved successfully!");

            callback(null);
        });
    }
], function (error) {
    if (error) {
        console.log("segment error : " + error);
    }
    console.log("segment completed!");
    process.exit(0);
});




