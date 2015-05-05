/**
 * Created by walter on 15-5-3.
 */

var async = require('async');
var config = require('../config');
var read = require('./testread');
var save = require('./save');

var newsList;
var newsContents = [];

async.series([

        // 读取新闻列表
        function (done) {
            read.getNewsList(config.url_eieug, null, function (error, list) {
                newsList = list;
                done(error);
            });
        },

        // 读取新闻内容
        function (done) {
            async.each(newsList, function (item, next) {
                read.getNewsContent(item, function (error, item) {
                    item.source = 'eieug';
                    newsContents.push(item);
                    next();
                });
            }, done);
        },

        // 新闻内容存入数据库
        function (done) {
            async.each(newsContents, function (item, next) {
                console.log(item);
                save.saveNewsContent(item, next);
            }, done);
        }

    ], function (error) {
        if (error) console.error(error);

        console.log('Completed!');
        process.exit(0);
    }
);