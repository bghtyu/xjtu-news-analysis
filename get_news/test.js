/**
 * Created by walter on 15-5-3.
 */

var async = require('async');
var config = require('../config');
var read = require('./testread');

read.getNewsList(config.url_eieug, null, function (error, list) {
    console.log(list);
});