/**
 * Created by walter on 15-4-14.
 */

var express = require('express');
var mongoose = require('mongoose');
var app = express();
var port = process.env.PORT || 3000;

app.use(express.static(__dirname + '/static'));

app.use(function (req, res) {
    res.sendFile(__dirname + '/static/index.html');
});

var server = app.listen(port, function() {
    console.log('XJTU is on port ' + port + '!')
});

var io = require('socket.io').listen(server);

io.sockets.on('connection', function (socket) {

    socket.on('getNewsList', function (listPage) {
        getNewsList(listPage,function (newsList) {
            socket.emit('newsList', newsList);
        });
    });

    socket.on('getNewsContent', function (newsId) {
        getNewsContent(newsId, function (newsContent) {
            socket.emit('newsContent', newsContent);
        });
    });

    socket.on('listRecord', function (listRecord) {
        saveListRecord(listRecord);
    });
});

// 数据库连接
mongoose.connect('mongodb://localhost/xjtu');

var Schema = mongoose.Schema;
var newsSchema = new Schema({
    source: { type: String, default: '' },
    title:  String,
    author: { type: String, default: '' },
    body:   { type: String, default: '' },
    url:    { type: String, index: { unique: true } },
    date:   { type: Date, default: Date.now },
    tags:   { type: [String], default: [] }
});

var News = mongoose.model('News', newsSchema);

function getNewsList (listPage,callback) {
    var listSkip = 0;
    var pageLimit = 15;
    if (listPage) {
        var page = listPage.match(/\d+/);
        if(page) {
            listSkip = (parseInt(page[0])-1)*pageLimit;
        }
    }
    News.count({}, function (error, count) {
        if (error) return error;
        if (listSkip >= count) {listSkip = 0;}
        if (listSkip < 0) {listSkip = 0;}

        var options = {skip: listSkip, limit: pageLimit, sort:{ "date":-1}};
        News.find({ }, 'title date', options, function (error, docs) {
            if (error) return error;

            var pageMax = (count%pageLimit) ? parseInt(count/pageLimit)+1 : parseInt(count/pageLimit);
            var result = {
                pageMax: pageMax,
                newsList: docs
            };
            callback(result);
        });
    });
}

function getNewsContent (newsId, callback) {
    News.findById(newsId, 'title date source author body', function (error, docs) {
        if (error) return error;

        callback(docs);
    });
}

var recordSchema = new Schema({
    recordType: { type: String, default: '' },
    userId: String,
    time: { type: Date, default: Date.now },
    newsId: { type: String, default: '' }
});

var Record = mongoose.model('Record', recordSchema);

function saveListRecord (listRecord) {
    var listRecordItem = new Record(listRecord);
    listRecordItem.save();
}
