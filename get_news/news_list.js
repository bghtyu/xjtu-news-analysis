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
                url: itemRaw[1],
                date: itemRaw[3]
            };
            newsList.push(item);
        }

        var regCurrentPage = /<li class="ecms_currentpage">(\d+)<\/li>/;
        var regNextPage = /<li class="nextpage"><a\s*href="(\/html\/tzgg\/(\d+)\.html)">\s*><\/a>\s*<\/li>/;
        var currentPage = body.toString().match(regCurrentPage)[1]; //获取当前页数
        var nextPage = body.toString().match(regNextPage)[2]; //获取下页页数
        var nextPageUrl = body.toString().match(regNextPage)[1]; //获取下页Url

        if (currentPage != nextPage) {
            // 读取下一页
            url.currentPage = nextPageUrl;
            getNewsList(url, function (error, newsList2) {
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

//var url = {
//    hostName: 'http://jwc.xjtu.edu.cn',
//    currentPage: '/html/tzgg/1.html'
//};
//
//getNewsList(url, function (error, newsList) {
//    if (error) console.error(error.stack);
//    console.log(newsList);
//});
