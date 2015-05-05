/**
 * Created by walter on 15-5-3.
 */

var async = require('async');
var schedule = require('node-schedule');
var config = require('../config');
var read = require('./testread');
var save = require('./save');

var rule = new schedule.RecurrenceRule();
var times = [];

for(var i=1; i<60; i=i+5){

    times.push(i);

}

rule.minute = times;

var j = schedule.scheduleJob(rule, function(){
    console.log('Update!', new Date());
    async.series([

            function (complete) {
                eieug(complete);
            },
            function (complete) {
                jwc(complete);
            },
            function (complete) {
                cy(complete);
            }

        ], function (error) {
            if (error) console.error(error);

            console.log('All Completed!', new Date());
            //process.exit(0);
        }
    );
});

function eieug (complete) {

    var newsList;
    var newsContents = [];

    async.series([

            // 读取新闻列表
            function (done) {
                if(config.update){
                    read.updateNewsList(config.url_eieug, function (error, list) {
                        newsList = list;
                        done(error);
                    });
                } else {
                    read.getNewsList(config.url_eieug, null, function (error, list) {
                        newsList = list;
                        done(error);
                    });
                }
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
                    save.saveNewsContent(item, next);
                }, done);
            }

        ], function (error) {
            if (error) console.error(error);

            console.log('eieug Completed!');
            complete(error);
        }
    );
}

function jwc (complete) {

    var newsList;
    var newsContents = [];

    async.series([

            // 读取新闻列表
            function (done) {
                if(config.update){
                    read.updateNewsList_jwc(config.url_jwc, function (error, list) {
                        newsList = list;
                        done(error);
                    });
                } else {
                    read.getNewsList_jwc(config.url_jwc, null, function (error, list) {
                        newsList = list;
                        done(error);
                    });
                }
            },

            // 读取新闻内容
            function (done) {
                async.each(newsList, function (item, next) {
                    read.getNewsContent_jwc(item, function (error, item) {
                        item.source = 'jwc';
                        newsContents.push(item);
                        next();
                    });
                }, done);
            },

            // 新闻内容存入数据库
            function (done) {
                async.each(newsContents, function (item, next) {
                    save.saveNewsContent(item, next);
                }, done);
            }

        ], function (error) {
            if (error) console.error(error);

            console.log('jwc Completed!');
            complete(error);
        }
    );
}

function cy (complete) {

    var newsList;
    var newsContents = [];

    async.series([

            // 读取新闻列表
            function (done) {
                if(config.update){
                    read.updateNewsList_cy(config.url_cy, function (error, list) {
                        newsList = list;
                        done(error);
                    });
                } else {
                    read.getNewsList_cy(config.url_cy, null, function (error, list) {
                        newsList = list;
                        done(error);
                    });
                }
            },

            // 读取新闻内容
            function (done) {
                async.each(newsList, function (item, next) {
                    read.getNewsContent_cy(item, function (error, item) {
                        item.source = 'cy';
                        newsContents.push(item);
                        next();
                    });
                }, done);
            },

            // 新闻内容存入数据库
            function (done) {
                async.each(newsContents, function (item, next) {
                    save.saveNewsContent(item, next);
                }, done);
            }

        ], function (error) {
            if (error) console.error(error);

            console.log('cy Completed!');
            complete(error);
        }
    );
}
