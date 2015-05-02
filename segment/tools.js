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

/**
 * 获得机构名称的别称
 * @param originName
 * @returns {*}
 */
exports.getOrgAnotherName = function (originName) {
    var dict = {
        //'合作与交流科': '合作与交流科',
        //'体育中心': '体育中心',
        //'教学研究科': '教学研究科',
        //'实践科': '实践科',
        //'教务科': '教务科',
        //'综合办公室': '综合办公室',
        //'教学计划与管理科': '教学计划与管理科',
        //'注册与考务科': '注册与考务科',
        '外国语学院': '外国语学院',
        '计算机教学实验中心': '计教中心',
        '机械学院': '机械工程学院',
        '数学学院': '数学学院',
        '人文学院': '人文学院',
        '电气学院': '电气工程学院',
        '航天学院': '航天航空学院',
        '化工学院': '化工学院',
        '公管学院': '公共政策与管理学院',
        '理学院': '理学院',
        '电信学院': '电子与信息工程学院',
        '管理学院': '管理学院',
        '人居学院': '人居学院',
        '材料学院': '材料学院',
        '经金学院': '经济与金融学院',
        '软件学院': '软件学院',
        '能动学院': '能源与动力工程学院',
        '生命学院': '生命科学与技术学院',
        '医学部': '医学部',
        '法学院': '法学院',
        '金禾中心': '金禾经济研究中心'
    };
    return dict[originName] ? dict[originName] : null;
};

exports.getSpecialWord = function () {
    return [
        '小学期',
        '本科毕业设计'
    ];
};