/**
 * Created by walter on 15-4-1.
 */

var async = require('async');
var config = require('../config');
var read = require('./read');
var save = require('./save');

var newsList;

async.series([

    // 读取新闻列表
    function (done) {
        read.getNewsList(config.url, function (error, list) {
            newsList = list;
            done(error);
        });
    },

    // 存储新闻列表
    function (done) {
        save.saveNewsList(newsList, done);
    },

    // 读取新闻内容并存入数据库
    function (done) {
        async.each(newsList, function (item, next) {
            read.getNewsContent(item, function () {
                item.source = 'jwc';
                save.saveNewsContent(item, next);
            });
        }, done);
    }

    ], function (error) {
        if (error) console.error(error);

        console.log('Completed!');
        process.exit(0);
    }
);
