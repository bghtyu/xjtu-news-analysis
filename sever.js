/**
 * Created by walter on 15-4-14.
 */

var express = require('express');
var sever = express();
var port = process.env.PORT || 3000;

sever.use(express.static(__dirname + '/static'));

sever.use(function (req, res) {
    res.sendFile(__dirname + '/static/index.html');
});

var io = require('socket.io').listen(sever.listen(port));

io.sockets.on('connection', function (socket) {
    socket.emit('connected');
});

console.log('Sever is on port ' + port + '!');
