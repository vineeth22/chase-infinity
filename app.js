var express = require('express');
var path = require('path');
var app = express();
var server = app.listen(3000, function () { console.log("Server running") });
var io = require('socket.io').listen(server);

app.use(express.static(path.join(__dirname, 'public')));

io.on('connection', function (socket) {
    console.log("User connected");
});