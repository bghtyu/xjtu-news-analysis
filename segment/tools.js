var fs = require("fs");

/**
 * 获取国家名，中文和英文
 * @param path 国家名文件路径
 * @param callback 回调函数
 */
exports.getCountry = function (path, callback) {

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


        var result_countries = {
            countries_en : result_en,
            countries_zh : result_zh
        };


        callback(null, result_countries);
    });
};

/**
 * 去除字符串中的HTML标签和&nbsp;
 * @param string
 * @returns {*|string|void|XML}
 */
exports.removeHTMLTag = function (string) {
    string = string.replace(/<\/?[^>]*>/g, "");
    string=string.replace(/&nbsp;/ig,'');//去掉&nbsp;
    return string;
};

