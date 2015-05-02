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
 * TODO 有一些分不出来e.g.韩国高丽大学、庆熙大学
 * “国外大学”规则：国家名+XXX+大学，总长度小于15
 * @param content
 * @param callback
 */
exports.collegeFilter = function(content, callback) {
    var result,
        pattern,
        string,
        temp;
    var REPLACE_STRING = '\u0001'; // 替换成的字符
    var LONGEST_COLLEGE = 15; // 最长的大学名字

    async.series([
        function (cb) {
            tools.getCountry('countries.txt', cb);
        }
    ], function (cb, result_countries) {
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
        pattern,
        temp;
    var REPLACE_STRING = '\u0002';
    var LONGEST_COURSE = 15;

    pattern = /《(.*)》/;
    temp = pattern.exec(content);
    if (pattern.test(content) && temp[1] && temp[0].length < LONGEST_COURSE) {
        result = {
            content : content.replace(pattern, REPLACE_STRING),
            target : temp[1],
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
        pattern,
        temp;
    var REPLACE_STRING = '\u0003';
    var LONGEST_TIME = 20;

    pattern = /(\d{4}.*\d{4}学年第.学期|\d{4}年\d{1,2}月\d{1,2}日|\d{4}学年|\d{4}年|\d{4}届|\d{4}级)/;
    temp = pattern.exec(content);

    if (pattern.test(content) && temp[1] && temp[0].length < LONGEST_TIME) {
        result = {
            content : content.replace(pattern, REPLACE_STRING),
            target : temp[1],
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
 * 专业测试 & 竞赛
 */
exports.contestFilter = function (content, callback) {
    var result,
        pattern,
        temp;
    var REPLACE_STRING = '\u0004';
    var LONGEST_CONTEST = 10;

    pattern = /(大学生.*竞赛|大学生.*比赛)/;

    temp = pattern.exec(content);
    if (pattern.test(content) && temp[1] && temp[0].length < LONGEST_CONTEST) {
        result = {
            content : content.replace(pattern, REPLACE_STRING),
            target : temp[1],
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
 * TODO 解决一个题目中出现多个特殊词汇
 * 特殊词汇：小学期、本科毕业设计
 */
exports.specialFilter = function (content, callback) {
    var result,
        pattern,
        temp;
    var REPLACE_STRING = '\u0005';
    var LONGEST_SPECIAL = 15;

    var specialWords = tools.getSpecialWord();

    for (var i = 0; i < specialWords.length; i++) {
        pattern = new RegExp("(" + specialWords[i] + ")");
        temp = pattern.exec(content);
        if (pattern.test(content) && temp[1] && temp[0].length < LONGEST_SPECIAL) {
            result = {
                content : content.replace(pattern, REPLACE_STRING),
                target : temp[1],
                replaceString : REPLACE_STRING
            };
            break;
        }
    }

    result = result ? result : {
        content : null,
        target : null,
        replaceString : REPLACE_STRING
    };

    callback(null, result);
};

/**
 * TODO 有些不是各个学院发布的消息，而是教务科发布的。e.g.http://jwc.xjtu.edu.cn/html/tzgg/jwgl/ksgl/2014/02/28/d7d2e413-168e-46c7-bde5-58768b22aa9e.html
 * 机构名称：e.g.金禾经济研究中心
 */
exports.orgFilter = function (content, org, callback) {
    var result,
        pattern,
        temp;
    var REPLACE_STRING = '\u0006';
    var LONGEST_ORG = 20;

    temp  = tools.getOrgAnotherName(org);
    if (temp) {
        pattern = new RegExp("(" + temp + "|" + org + ")");
    } else {
        pattern = new RegExp("(" + org + ")");
    }

    temp = pattern.exec(content);
    if (pattern.test(content) && temp[1] && temp[0].length < LONGEST_ORG) {
        result = {
            content : content.replace(pattern, REPLACE_STRING),
            target : temp[1],
            replaceString : REPLACE_STRING
        };
    } else {
        result = {
            content : null,
            target : null,
            replaceString : REPLACE_STRING
        };
    }
    callback(null, result);
};

