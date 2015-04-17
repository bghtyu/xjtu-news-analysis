/**
 * Created by walter on 15-4-8.
 */

var read = require('./read');

var item = {
    "title" : "2015年全国大学生英语竞赛准考证领取通知",
    "url" : "http://jwc.xjtu.edu.cn/html/tzgg/zhsw/jsks/2015/04/08/691434a9-cea8-4414-95fc-59e1482f36a0.html",
    "date" : "2015-04-03T00:00:00Z",
    "body" : "",
    "author" : "",
    "source" : ""
};

read.getNewsContent(item, function () {
    console.log(item);
});