/**
 * Created by walter on 15-4-14.
 */

var express = require('express');
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

var newsList = [
    'gvaredgvads',
    'grvafdbvefdbvsd',
    'myfhgjhmyfum'
];

io.sockets.on('connection', function (socket) {
    //console.log('connection');
    socket.on('getNewsList', function () {
        socket.emit('newsList', newsList)
    });
});

//console.log('Sever is on port ' + port + '!');
