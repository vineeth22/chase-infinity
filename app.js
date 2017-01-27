var express = require('express');
var path = require('path');
var app = express();
var server = app.listen(3000, function () { console.log("Server running") });
var io = require('socket.io').listen(server);
var paper = require('./src/paperFunctions.js');

app.use(express.static(path.join(__dirname, 'public')));

io.on('connection', function (socket) {
    console.log("User connected");
    socket.on('newPlayer', function () {
        paper.getNewPlayer(socket.id, function (newPlayer, playerGroup) {
            io.to(socket.id).emit('playerGroup',JSON.stringify(playerGroup));
            socket.broadcast.emit('newPlayer', JSON.stringify(newPlayer));
        })
    }
    );
    
});