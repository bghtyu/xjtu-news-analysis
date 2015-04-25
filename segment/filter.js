var async = require("async");
var tools = require("./tools");




/**
 * “国外大学”规则：国家名+XXX+大学，总长度小于15
 * @param content
 * @param callback
 */
function collegeFilter(content, callback) {
    var result,
        pattern,
        string;
    var REPLACE_STRING = '\u0001'; // 替换成的字符
    var LONGEST_COLLEGE = 15; // 最长的大学名字

    async.series([
        function (cb) {
            tools.getCountry('countries.txt', cb);
        }
    ], function (cb, result_countries) {
        // @TODO 正则表达式性能改进
        var len = result_countries[0].countries_zh.length;
        for (var i = 0; i < len; i++) {
            string = result_countries[0].countries_zh[i];
            pattern = new RegExp("(" + string + ".*大学)");
            if (pattern.test(content) && pattern.exec(content)[0].length < LONGEST_COLLEGE) {
                result = {
                    content : content.replace(pattern, REPLACE_STRING),
                    college : pattern.exec(content)[0]
                }
            }
        }
        callback(null, result);
    });

}

exports.collegeFilter = collegeFilter;