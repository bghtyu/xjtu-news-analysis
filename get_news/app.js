/**
 * Created by walter on 15-4-1.
 */

var async = require('async');
var config = require('../config');
var get = require('./get');
var save = require('./save');

var newsList;

async.series([

    function (done) {
        get.getNewsList(config.url, function(error, list) {
            newsList = list;
            done(error);
        });
    },

    function (done) {
        save.saveArticleList(newsList, done);
    }

], function (error) {
    if (error) console.error(error);

    console.log('Completed!');
    process.exit(0);
});
