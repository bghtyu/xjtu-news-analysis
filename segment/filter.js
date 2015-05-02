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
 * TODO
 * 专业测试 & 竞赛
 */
exports.contestFilter = function (content, callback) {
    var result,
        pattern,
        temp;
    var REPLACE_STRING = '\u0004';
    var LONGEST_CONTEST = 10;

    pattern = /(辅修课程)/;

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
 * TODO
 * 特定词汇：小学期
 */
exports.specialFilter = function (content, callback) {
    var result,
        pattern,
        temp;
    var REPLACE_STRING = '\u0005';
    var LONGEST_SPECIAL = 15;

    pattern = /dfs/;

    temp = pattern.exec(content);
    if (pattern.test(content) && temp[1] && temp[0].length < LONGEST_SPECIAL) {
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
 * 机构名称：e.g.金禾经济研究中心
 */
exports.orgFilter = function (content, org, callback) {
    var result,
        pattern,
        temp;
    var REPLACE_STRING = '\u0006';
    var LONGEST_ORG = 20;

    if (temp = tools.getOrgAnotherName(org)) {
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

