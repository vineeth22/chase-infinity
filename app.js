var express = require('express');
var path = require('path');
var app = express();
var server = app.listen(3000, function () { console.log("Server running") });
var io = require('socket.io').listen(server);
var paper = require('./src/paperFunctions.js');

paper.initGame();

app.use(express.static(path.join(__dirname, 'public')));

io.on('connection', function (socket) {
    console.log("User connected");
    socket.on('newPlayer', function () {
        paper.getNewPlayer(socket.id, function (newPlayer, playerGroup, outerPath, innerPath, obstacleGroup, fuelGroup) {
            io.to(socket.id).emit('gameState', { player: newPlayer, playerGroup: playerGroup, outerPath: outerPath, innerPath: innerPath, obstacleGroup: obstacleGroup, fuelGroup });
            socket.broadcast.emit('newPlayer', newPlayer);
            /* paper.newObstacle(function (newObstacle) {
                 io.emit('newObstacle', newObstacle);
             });   */
        })
    }
    );

    socket.on('keyStateChange', function (player) {
        socket.broadcast.emit('keyStateChange', player);
        paper.keyStateChange(player);
    })
    socket.on('collision', function (player) {
        socket.broadcast.emit('keyStateChange', player);
        paper.keyStateChange(player);
    })
    socket.on('removeFuel', function (fuelName) {
        socket.broadcast.emit('removeFuel', fuelName);
        paper.removeFuel(fuelName);
        paper.newFuel(function (fuel) {
            io.emit('newFuel', fuel);
        });


    })
    socket.on('disconnect', function () {
        console.log("User disconnected");
        io.emit('leavePlayer', socket.id);
        paper.removePlayer(socket.id);
    })

});
/*

setInterval(function () {
    
}, 1000);*/
