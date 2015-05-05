/**
 * Created by walter on 15-4-8.
 */

var request = require('request');
var cheerio = require('cheerio');
var config = require('../config');
var iconv = require('iconv-lite');

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
                url: url.hostName + $self.attr('href'),
                host: url.hostName
            };
            newsList.push(item);
        });

        var pageNum = parseInt(url.listPage.match(url.urlReg)[2]);

        if (pageNum+1 == pageMax) {
            // 返回结果
            callback(null, newsList);
        } else {
            // 读取下一页
            url.listPage = url.listPage.match(url.urlReg);
            url.listPage = url.listPage[1] + (parseInt(url.listPage[2])+1);
            exports.getNewsList(url, pageMax, function (error, newsList2) {
                if (error) return callback(error);
                // 合并结果
                callback(null, newsList.concat(newsList2));
            });
        }
    });
};

exports.updateNewsList = function (url, callback) {
    var options = config.requestOptions;
    options.url = url.hostName + url.listPage;

    request(options, function (error, response, body) {
        if (error) return callback(error);

        var $ = cheerio.load(body.toString());
        var newsList = [];

        $('.li2 a').each(function () {
            var $self = $(this);
            var item = {
                title: $self.text().trim(),
                date: $self.parent().next().text().match(/\[(\d\d-\d\d)\]/)[1],
                url: url.hostName + $self.attr('href'),
                host: url.hostName
            };
            newsList.push(item);
        });

        callback(null, newsList);

    });
};

exports.getNewsContent = function (item, callback) {
    var options = config.requestOptions;
    options.url = item.url;

    request(options, function (error,response,body) {
        if (error) return callback(error);

        var $ = cheerio.load(body.toString());

        var temp = $('div .author').text().trim();
        item.author = temp.match(/发布者：(.+)\s{3}发布于/) ? temp.match(/发布者：(.+)\s{3}发布于/)[1] : '';
        item.date = temp.match(/发布于(\d{4}-\d\d-\d\d \d\d:\d\d)/) ? temp.match(/发布于(\d{4}-\d\d-\d\d \d\d:\d\d)/)[1] : '';

        $body = $('div #content');
        $body.find('img').each(function (){
            var src = item.host + $(this).attr('src');
            $(this).attr('src', src);
            $(this).attr('width', '800px');
        });
        $body.find('a').each(function (){
            var href = item.host + $(this).attr('href');
            $(this).attr('href', href);
        });
        item.body = $body.html();

        callback(null, item);
    });
};






exports.getNewsList_cy = function (url, pageMax, callback) {
    var options = config.requestOptions;
    options.url = url.hostName +'/'+ url.listPage;
    options.encoding = null;

    request(options, function (error, response, body) {
        if (error) return callback(error);

        body = iconv.decode(body, 'gbk');

        var $ = cheerio.load(body.toString());
        var newsList = [];
        if (!pageMax) {
            var pageMax = parseInt($('.show_page a').last().attr('href').match(url.urlReg)[2]);
        }

        $('div .title_list table tr').each(function () {
            var $self = $(this);
            var item = {
                title: $self.children().eq(1).children('a').text().trim(),
                date: $self.children().eq(2).text().trim(),
                url: url.hostName +'/'+ $self.children().eq(1).children('a').attr('href'),
                host: url.hostName
            };

            newsList.push(item);
        });

        var pageNum = parseInt(url.listPage.match(url.urlReg)[2]);

        if (pageNum == pageMax) {
            // 返回结果
            callback(null, newsList);
        } else {
            // 读取下一页
            url.listPage = url.listPage.match(url.urlReg);
            url.listPage = url.listPage[1] + (parseInt(url.listPage[2])+1);
            exports.getNewsList_cy(url, pageMax, function (error, newsList2) {
                if (error) return callback(error);
                // 合并结果
                callback(null, newsList.concat(newsList2));
            });
        }
    });
};

exports.updateNewsList_cy = function (url, callback) {
    var options = config.requestOptions;
    options.url = url.hostName +'/'+ url.listPage;
    options.encoding = null;

    request(options, function (error, response, body) {
        if (error) return callback(error);

        body = iconv.decode(body, 'gbk');

        var $ = cheerio.load(body.toString());
        var newsList = [];

        $('div .title_list table tr').each(function () {
            var $self = $(this);
            var item = {
                title: $self.children().eq(1).children('a').text().trim(),
                date: $self.children().eq(2).text().trim(),
                url: url.hostName +'/'+ $self.children().eq(1).children('a').attr('href'),
                host: url.hostName
            };

            newsList.push(item);
        });

        callback(null, newsList);

    });
};

exports.getNewsContent_cy = function (item, callback) {
    var options = config.requestOptions;
    options.url = item.url;
    options.encoding = null;

    request(options, function (error,response,body) {
        if (error) return callback(error);

        body = iconv.decode(body, 'gbk');

        var $ = cheerio.load(body.toString());

        var temp = $('div .content_auto').text().trim();
        item.author = $('div .content_auto a').text();
        item.date = temp.match(/(\d{4}-\d\d-\d\d \d\d:\d\d)/) ? temp.match(/(\d{4}-\d\d-\d\d \d\d:\d\d)/)[1] : '';

        $body = $('div #endtext');
        $body.find('img').each(function (){
            var src = item.host + $(this).attr('src');
            $(this).attr('src', src);
            $(this).attr('width', '800px');
        });
        $body.find('a').each(function (){
            var href = item.host + $(this).attr('href');
            $(this).attr('href', href);
        });
        item.body = $body.html();

        callback(null, item);
    });
};



exports.getNewsList_jwc = function (url, pageMax, callback) {
    var options = config.requestOptions;
    options.url = url.hostName + url.listPage;

    request(options, function (error, response, body) {
        if (error) return callback(error);

        var $ = cheerio.load(body.toString());
        var newsList = [];
        if (!pageMax) {
            var pageMax = parseInt($('div .ecms_pagination ul li').last().prev().text());
        }

        $('div .list_main_content div').each(function () {
            var $self = $(this);
            var item = {
                title: $self.children('a').text().trim(),
                date: $self.children('.list_time').text().trim(),
                url: url.hostName + $self.children('a').attr('href'),
                host: url.hostName
            };
            newsList.push(item);
        });

        var pageNum = parseInt(url.listPage.match(url.urlReg)[2]);

        if (pageNum == pageMax) {
            // 返回结果
            callback(null, newsList);
        } else {
            // 读取下一页
            url.listPage = url.listPage.match(url.urlReg);
            url.listPage = url.listPage[1] + (parseInt(url.listPage[2])+1) + url.listPage[3];
            exports.getNewsList_jwc(url, pageMax, function (error, newsList2) {
                if (error) return callback(error);
                // 合并结果
                callback(null, newsList.concat(newsList2));
            });
        }
    });
};

exports.updateNewsList_jwc = function (url, callback) {
    var options = config.requestOptions;
    options.url = url.hostName + url.listPage;

    request(options, function (error, response, body) {
        if (error) return callback(error);

        var $ = cheerio.load(body.toString());
        var newsList = [];

        $('div .list_main_content div').each(function () {
            var $self = $(this);
            var item = {
                title: $self.children('a').text().trim(),
                date: $self.children('.list_time').text().trim(),
                url: url.hostName + $self.children('a').attr('href'),
                host: url.hostName
            };
            newsList.push(item);
        });

        callback(null, newsList);

    });
};

exports.getNewsContent_jwc = function (item, callback) {
    var options = config.requestOptions;
    options.url = item.url;

    request(options, function (error,response,body) {
        if (error) return callback(error);

        var $ = cheerio.load(body.toString());

        var temp = $('.detail_main_content h1').html().trim();
        item.author = temp.match(/span>\s*(\S*)\s*<span/) ? temp.match(/span>\s*(\S*)\s*<span/)[1] : '';
        item.date = temp.match(/\d{4}-\d\d-\d\d/) ? temp.match(/\d{4}-\d\d-\d\d/)[0] : item.date;

        $body = $('div .detail_content_display').next();
        $body.find('img').each(function (){
            var src = item.host + $(this).attr('src');
            $(this).attr('src', src);
            $(this).attr('width', '800px');
        });

        $file = $('div .detail_annex');
        $file.find('a').each(function (){
            var href = item.host + $(this).attr('href');
            $(this).attr('href', href);
        });
        $file.find('img').each(function (){
            var src = item.host + $(this).attr('src');
            $(this).attr('src', src);
        });
        item.body = $body.html() + ($file.html() ? $file.html() : '');

        callback(null, item);
    });
};