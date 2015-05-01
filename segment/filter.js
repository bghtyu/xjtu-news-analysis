/**
 * 类别：
 * \u0001 : college
 * \u0002 : course
 * \u0003 : time
 * \u0004 : contest
 * \u0005 : special
 * \u0006 : organization
 */

var async = require("async");
var tools = require("./tools");


/**
 * “国外大学”规则：国家名+XXX+大学，总长度小于15
 * @param content
 * @param callback
 */
exports.collegeFilter = function(content, callback) {
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
                    target : pattern.exec(content)[1],
                    replaceString : REPLACE_STRING

                };
            }
        }

        result = result ? result : {
            content : null,
            college : null,
            replaceString : REPLACE_STRING
        };

        callback(null, result);
    });

};

/**
 * 课程名称
 */
exports.courseFilter = function (content, callback) {
    var result,
        pattern;
    var REPLACE_STRING = '\u0002';
    var LONGEST_COURSE = 15;

    pattern = /《(.*)》/;
    if (pattern.test(content) && pattern.exec(content)[0].length < LONGEST_COURSE) {
        result = {
            content : content.replace(pattern, REPLACE_STRING),
            target : pattern.exec(content)[1],
            replaceString : REPLACE_STRING
        };
    } else {
        result = {
            content : null,
            target : null,
            replaceString : REPLACE_STRING
        }
    }
    callback(null, result);
};

/**
 * 学期，学年，2015级
 */
exports.timeFilter = function (content, callback) {
    var result,
        pattern;
    var REPLACE_STRING = '\u0003';
    var LONGEST_TIME = 15;
};

/**
 * 专业测试 & 竞赛
 */
exports.contestFilter = function () {

};

/**
 * 特定词汇：小学期
 */
exports.specialFilter = function () {
    
};

/**
 * 机构名称：金禾经济研究中心
 */
exports.orgFilter = function () {
    
};

