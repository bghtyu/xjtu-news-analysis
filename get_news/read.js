/**
 * Created by walter on 15-3-31.
 */

var request = require('request');

exports.getNewsList = function (url, callback) {
    var options = {
        url: url.hostName + url.currentPage,
        method: 'GET',
        headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 6.3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/41.0.2272.89 Safari/537.36',
            'Accept-Language': 'zh-CN,zh;q=0.8'
        }
    };

    request(options, function (error,response,body) {
        if (error) return callback(error);

        // 用正则取出列表中的文章标题和网址
        var regAll = /<a style="float\:left; " href="([^"]*)">([^"]*)<\/a>\s*<span class="list_time">(\d{4}-\d{2}-\d{2})<\/span>/gi;
        var regItem = /<a style="float\:left; " href="([^"]*)">([^"]*)<\/a>\s*<span class="list_time">(\d{4}-\d{2}-\d{2})<\/span>/i;
        var newsRaw = body.toString().match(regAll);

        var newsList = [];
        for (var i=0; i<newsRaw.length; i++) {
            var itemRaw = newsRaw[i].match(regItem);
            var item = {
                title: itemRaw[2],
                url: url.hostName + itemRaw[1],
                date: itemRaw[3]
            };
            newsList.push(item);
        }

        console.log(newsList[0].date);

        var regCurrentPage = /<li class="ecms_currentpage">(\d+)<\/li>/;
        var regNextPage = /<li class="nextpage"><a\s*href="(\/html\/tzgg\/(\d+)\.html)">\s*><\/a>\s*<\/li>/;
        var currentPage = body.toString().match(regCurrentPage)[1]; //获取当前页数
        var nextPage = body.toString().match(regNextPage)[2]; //获取下页页数
        var nextPageUrl = body.toString().match(regNextPage)[1]; //获取下页Url

        if ((currentPage != nextPage) && (!url.update)) {
            // 读取下一页
            url.currentPage = nextPageUrl;
            exports.getNewsList(url, function (error, newsList2) {
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

exports.getNewsContent = function (item, callback) {

    var options = {
        url: item.url,
        method: 'GET',
        headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 6.3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/41.0.2272.89 Safari/537.36',
            'Accept-Language': 'zh-CN,zh;q=0.8'
        }
    };

    request(options, function (error,response,body) {
        if (error) return callback(error);

        var regTitle = /<div class="detail_main_content".*?>\s*<h3>(.*?)<\/h3>\s*<h1><span>.*?<\/span>\s([^<]*)\s<span>.*?<\/span>(\d{4}-\d\d-\d\d)/i;
        var regContent = /<div class="detail_content_display">[^<]*<\/div>\s*<div[^>]*>(.*?)<\/div>/i;
        //var regFile = /<div\s*cmsid="09230985".*?>[^°]*?(<\/span><a[^°]*?href="([^"]*)">([^<]*)<\/a>[^°]*?<\/li>)[^°]*?<\/div>/i;

        var titleRaw = body.match(regTitle);
        if (titleRaw) {
            item.title = titleRaw[1];
            item.author = titleRaw[2];
            item.date = titleRaw[3];
        }
        var contentRaw = body.match(regContent);
        if (contentRaw) {
            item.body = contentRaw[1];
        }

        callback();
    });
};
