/**
 * Created by walter on 15-4-8.
 */

var request = require('request');
var cheerio = require('cheerio');
var config = require('../config');

exports.getNewsList = function (url, pageMax, callback) {
    var options = config.requestOptions;
    options.url = url.hostName + url.listPage;

    request(options, function (error, response, body) {
        if (error) return callback(error);

        var $ = cheerio.load(body.toString());
        var newsList = [];
        if (!pageMax) {
            var pageMax = parseInt($('#rPage_R ul li a').last().attr('href').match(url.urlReg)[2]);
        }

        $('.li2 a').each(function () {
            var $self = $(this);
            var item = {
                title: $self.text().trim(),
                date: $self.parent().next().text().match(/\[(\d\d-\d\d)\]/)[1],
                url: $self.attr('href')
            };
            newsList.push(item);
        });

        var pageNum = parseInt(url.listPage.match(url.urlReg)[2]);

        if (pageNum+1 != pageMax) {
            // 读取下一页
            url.listPage = url.listPage.match(url.urlReg);
            url.listPage = url.listPage[1] + (parseInt(url.listPage[2])+1);
            exports.getNewsList(url, pageMax, function (error, newsList2) {
                if (error) return callback(error);
                // 合并结果
                callback(null, newsList.concat(newsList2));
            });
        } else {
            // 返回结果
            callback(null, newsList);
        }

    });
};