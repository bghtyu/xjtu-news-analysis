/**
 * Created by zhaofengmiao on 15/4/11.
 */
var nodejieba = require("nodejieba");
var mongoose = require("mongoose");
var async = require("async");
var fs = require("fs");


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


var result_news;
var titles = [];
var result_countries;

async.series([
    // 把国家名存到result_countries
    function (callback) {
        getCountry('./countries.txt', callback);
    },
    function(callback){
        News.find({}, "title date body url", function(error, docs){
            if (error) {
                console.log(error);
                done(error);
            }
            result_news = docs;
            for (var i = 0; i < docs.length; i++) {
                titles.push(docs[i].title);
            }
            callback(null, docs);
        });
    },
    function (callback) {
        var result;

        async.eachSeries(result_news, function (item, next) {
            async.series([
                function (callback) {
                    result = collegeFilter(item.title);
                    callback(null);
                }
            ], function (callback) {
                    var cutDst = result ? result.content : item.title;
                    nodejieba.cut(cutDst, function (wordList) {
                        for (var i = 0; i < wordList.length; i++) {
                            wordList[i] = wordList[i].replace("\u0001", result ? result.college : '');
                        }

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
                }
            );

        }, callback);
    },
    function (callback) {

        async.eachSeries(result_news, function (item, next) {
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
    //,
    //function (callback) {
    //    var newTitles = [];
    //    for (var i = 0; i < titles.length; i++) {
    //        var len = result_countries.countries_zh.length;
    //        for (var j = 0; j < len; j++) {
    //            var string = result_countries.countries_zh[j];
    //            var regexp = new RegExp("(" + string + ".*大学)");
    //            if (regexp.test(titles[i] || titles[i].indexOf("韩国"))) {
    //                newTitles.push(titles[i]);
    //            }
    //        }
    //    }
    //    console.log(newTitles);
    //    console.log("total length:" + newTitles.length);
    //    callback(null);
    //}
], function (error) {
    if (error) {
        console.log("segment error : " + error);
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

/**
 * 获取国家名，中文和英文
 * @param path 国家名文件路径
 * @param callback 回调函数
 */
function getCountry(path, callback) {

    var result_zh = [];
    var result_en = [];

    fs.readFile(path, "utf-8", function (error, data) {
        if (error) {
            throw error;
        }

        var countries = data.split('\n');
        var countriesLen = countries.length;

        for (var i = 0; i < countriesLen; i++) {
            var parts = countries[i].split(',');
            for (var j = 0; j < parts.length; j++) {
                parts[j] = parts[j].trim();
            }
            result_en.push(parts[0]);
            result_zh.push(parts[1]);
        }


        result_countries = {
            countries_en : result_en,
            countries_zh : result_zh
        };

        callback(null);
    });
}

function collegeFilter(content) {
    var result,
        pattern,
        string,
        countries = result_countries.countries_zh;
    var REPLACE_STRING = '\u0001'; // 替换成的字符
    var LONGEST_COLLEGE = 15; // 最长的大学名字

    // @TODO 正则表达式性能改进
    var len = countries.length;
    for (var i = 0; i < len; i++) {
        string = countries[i];
        pattern = new RegExp("(" + string + ".*大学)");
        if (pattern.test(content) && pattern.exec(content)[0].length < LONGEST_COLLEGE) {
            result = {
                content : content.replace(pattern, REPLACE_STRING),
                college : pattern.exec(content)[0]
            }
        }
    }

    return result;
}

