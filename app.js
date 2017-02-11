var express = require('express');
var path = require('path');
var app = express();
var server = app.listen(3007, function () { console.log("Server running") });
var io = require('socket.io').listen(server);
var bodyparser = require("body-parser");
var session = require('client-sessions');
var paper = require('./src/paperFunctions.js');
var db = require('./src/db.js');


app.use(bodyparser.urlencoded({ extended: true }));
app.use(bodyparser.json({ type: "application/json" }));


app.use(session({
    cookieName: "sess",
    secret: "134klh389dbcbsldvn1mcbj",
    duration: 30 * 60 * 1000, //30 min session duration
    activeDuration: 5 * 60 * 1000 //5 min active session
}));


app.use("/", function (req, res, next) {   //enforce a cookie requirement for all requests starting with '/' 
	if (!req.sess.username) {              //i.e. accessing the server needs session to be set
		console.log("redirecting cookie not found");
		//req.sess.username = "JacquesTesting"; // Jacques: DISABLE WHEN DEPLOYING
        res.redirect("http://teknack.in"); //this url will be provided later // Jacques: Uncomment on deployment
		//next(); // Jacques: Disable on deployment
	} else {
		next();
	}
});


app.use(express.static(path.join(__dirname, 'public')));

/*app.post('/login', function (req, res) {
    req.sess.username = req.body.username;
    res.sendStatus(200);
    //res.redirect("index.html");
});
*/
paper.initGame();

io.on('connection', function (socket) {

    var cookie_string = socket.request.headers.cookie;
    var req = { headers: { cookie: cookie_string } };
    session({
        cookieName: "sess",
        secret: "134klh389dbcbsldvn1mcbj",
        duration: 30 * 60 * 1000, //30 min session duration
        activeDuration: 5 * 60 * 1000 //5 min active session
    })(req, {}, function () { });

    if (!req.sess.username) {
        socket.disconnect();
    }
    else {
        var username = req.sess.username;
        console.log(username + " connected");
    }

    socket.on('newPlayer', function () {
        db.getUserData(username, function (user) {
            //            console.log(user);
            paper.getNewPlayer(username, function (newPlayer, playerGroup, outerPath, innerPath, obstacleGroup, fuelGroup) {
                io.to(socket.id).emit('gameState', { player: newPlayer, playerGroup: playerGroup, outerPath: outerPath, innerPath: innerPath, obstacleGroup: obstacleGroup, fuelGroup });
                socket.broadcast.emit('newPlayer', newPlayer);
           //     console.log(username + " playing");
            })
        });


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
    socket.on('leavePlayer', function (player) {
        console.log(username + " stopped playing");
        io.emit('leavePlayer', username);
        paper.removePlayer(username, function (score) {
            db.putUserData(player[1].name, Math.floor(player[1].data.distance));
        });
    })
    socket.on('disconnect', function () {
        console.log(username + " disconnected");
        io.emit('leavePlayer', username);
        paper.removePlayer(username, function (score) {
            if (score)
                db.putUserData(username, score);
        });
    })
    socket.on('getLeaderboard', function () {
        db.getLeaderboard(function (data) {
            io.to(socket.id).emit('leaderboardList', data);
        })
    })
    socket.on('getHighScore', function () {
        db.getUserData(username, function (data) {
            io.to(socket.id).emit('highScore', data.score);
        })
    })
});

