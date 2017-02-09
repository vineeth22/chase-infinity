

var gameState = 1; //1 start screen, 2 main game, 3 exit state
var leaderboardClicked = 0;
var rulesClicked = 0;
var startScreen = new Group();
var startScreenCenter = new Point(view.center);

//console.log(view.onFrame);
var gameName = new PointText({
    point: new Point(view.bounds.topLeft.x + view.bounds.width * 0.5, view.bounds.topLeft.y + view.bounds.height * 0.2),
    content: 'Chase Infinity',
    fillColor: 'white',
    fontSize: 45,
    justification: 'center',
    strokeColor: 'black',
    visible: false
});

var startGame = new PointText({
    point: new Point(view.bounds.topLeft.x + view.bounds.width * 0.3, view.bounds.topLeft.y + view.bounds.height * 0.4),
    content: 'Start Game',
    fillColor: 'white',
    fontSize: 25,
    justification: 'center',
    strokeColor: 'black',
    strokeWidth: 0.5,
    visible: false
});

var rules = new PointText({
    point: new Point(view.bounds.topLeft.x + view.bounds.width * 0.5, view.bounds.topLeft.y + view.bounds.height * 0.4),
    content: 'Rules',
    fillColor: 'white',
    fontSize: 25,
    justification: 'center',
    strokeColor: 'black',
    strokeWidth: 0.5,
    visible: false
});

var leaderboard = new PointText({
    point: new Point(view.bounds.topLeft.x + view.bounds.width * 0.7, view.bounds.topLeft.y + view.bounds.height * 0.4),
    content: 'Leaderboard',
    fillColor: 'white',
    fontSize: 25,
    justification: 'center',
    visible: false,
    strokeColor: 'black',
    strokeWidth: 0.5
});

var leaderboardList = new PointText({
    point: new Point(view.bounds.topLeft.x + view.bounds.width * 0.5, view.bounds.topLeft.y + view.bounds.height * 0.6),
    content: '',
    fillColor: 'white',
    fontSize: 20,
    justification: 'center',
    visible: false,
//    strokeColor: 'black',
//    strokeWidth: 0.5
});

var yourScore = new PointText({
    point: new Point(view.bounds.topLeft.x + view.bounds.width * 0.5, view.bounds.topLeft.y + view.bounds.height * 0.5),
    content: '',
    fillColor: 'white',
    fontSize: 25,
    justification: 'center',
    visible: false,
    strokeColor: 'black',
    strokeWidth: 0.5
});
startScreen.addChild(gameName);
startScreen.addChild(startGame);
startScreen.addChild(rules);
startScreen.addChild(leaderboard);
startScreen.addChild(yourScore);
var highScore = function (score) {
//    console.log("hi");
    yourScore.content = 'Your Score: ' + score;
}
var leaderboardListFunc = function (data) {
    leaderboardClicked = 1;
    leaderboardList.content = '';
    for (var i = 0; i < data.length; i++) {
        leaderboardList.content +=  data[i].username + "   " + data[i].score + "\n";
    }
    leaderboardList.visible = true;
//    console.log(data);
}
socket.on('highScore', highScore);
socket.on('leaderboardList', leaderboardListFunc);
socket.emit('getHighScore');

function showGroup(group) {
    for (var i = 0; i < group.children.length; i++) {
        group.children[i].visible = true;
    }
}

function hideGroup(group) {
    for (var i = 0; i < group.children.length; i++) {
        group.children[i].visible = false;
    }
}

function removeSymbols() {
    var length = placedSymbols.length - 1;
    for (var i = length; i >= 0; i--) {
        placedSymbols[i].remove();
        placedSymbols.pop();
    }
    //    console.log(placedSymbols.length);
}

showGroup(startScreen)

startGame.onClick = function (event) {
    hideGroup(startScreen);
    view.detach('frame', symbolAnim);
    removeSymbols();
    //    socket = io();
    socket.on('gameState', gameStateFunc);
    socket.on('newPlayer', newPlayerFunc);
    socket.on('newFuel', newFuelFunc);
    socket.on('removeFuel', removeFuelFunc);
    socket.on('keyStateChange', keyStateChangeFunc);
    socket.on('leavePlayer', leavePlayerFunc);
    socket.emit('newPlayer');
}

leaderboard.onClick = function (event) {
    if (leaderboardClicked == 0) {
        socket.emit('getLeaderboard');
    }
    else {
        leaderboardList.visible = false;
        leaderboardClicked = 0;
    }
}

/**********************************************/


var count = 50;

var path = new Path.Circle({
    center: [0, 0],
    radius: 5,
    fillColor: 'white',
    strokeColor: 'black'
});

var symbol = new Symbol(path);

var placedSymbols = []

function createSymbols() {
    for (var i = 0; i < count; i++) {
        var point = Point.random() * ((view.bounds.bottomRight));
        while (!view.bounds.contains(point))
            var point = Point.random() * ((view.bounds.bottomRight));
        var center = point;
        var placed = symbol.place(center);
        placed.scale(i / count + 0.001);
        placed.data.vector = new Point({
            angle: Math.random() * 360,
            length: (i / count) * Math.random() / 5
        });
        placed.sendToBack();
        placedSymbols.push(placed);
    }
}

createSymbols();
var symbolAnim = function (event) {
    for (var i = 0; i < placedSymbols.length; i++) {
        var item = placedSymbols[i];
        //var size = item.bounds.size;
        //        var length = vec.length / 1.5 * size.width / 10;
        item.position += item.data.vector;
        keepInView(item);
    }
}
view.attach('frame', symbolAnim);

/******************************************** */

var leaveGameText = new PointText({
    point: [50, 15],
    content: 'Press excape again to leave game or C to continue',
    fillColor: 'white',
    fontSize: 15,
    visible: false
});

var scoreText = new PointText({
    point: [50, 15],
    content: 'Score',
    fillColor: 'white',
    fontSize: 15,
    visible: false
});
var scoreValue = new PointText({
    point: [100, 15],
    content: 'Score',
    fillColor: 'white',
    fontSize: 15,
    visible: false
});

var energyText = new PointText({
    point: [50, 15],
    content: 'Energy',
    fillColor: 'white',
    fontSize: 15,
    visible: false
});
var energyValue = new Shape.Rectangle({
    point: [20, 20],
    size: [80, 10],
    fillColor: 'white',
    visible: false
});

var lowEnergyText = new PointText({
    point: [50, 15],
    content: 'Energy low',
    fillColor: 'white',
    fontSize: 18,
    visible: false
});

var energyValueText = new PointText({
    point: [50, 15],
    content: 'Energy',
    fillColor: 'white',
    fontSize: 15,
    visible: false
});


var collisionDelay = 0;
var obstacleGroup = new Group();
var playerTextGroup = new Group();
var fuelGroup = new Group();
var playerGroup = new Group();
var gameData = new Group;
var mainGameGroup = new Group();

var player;
var outerPath;
var innerPath;

mainGameGroup.addChild(gameData);
mainGameGroup.addChild(playerGroup);
mainGameGroup.addChild(fuelGroup);


gameData.addChild(scoreValue);
gameData.addChild(scoreText);
gameData.addChild(energyValue);
gameData.addChild(energyText);
gameData.addChild(energyValueText);
gameData.addChild(lowEnergyText);
//gameData.addChild(leaveGameText);
//console.log(socket);


//socket.emit('newPlayer');

//view.zoom=0.5;





var gameStateFunc = function (data) {

    outerPath = new Path(data.outerPath[1]);

    innerPath = new Path(data.innerPath[1]);

    _playerGroup = data.playerGroup;

    if (_playerGroup[1].children != null) {
        for (var i = 0; i < _playerGroup[1].children.length; i++) {
            playerGroup.addChild(new Path(_playerGroup[1].children[i][1]));
        }
        for (var i = 0; i < playerGroup.children.length; i++) {
            createVector(playerGroup.children[i], playerGroup.children[i]);
        }

        var tempVec = new Point({
            angle: -90,
            length: 45
        })

        for (var i = 0; i < playerGroup.children.length; i++) {
            var _newPlayerText = new PointText({
                point: playerGroup.children[i].position.add(tempVec),
                content: playerGroup.children[i].name,
                fillColor: 'white',
                fontSize: 15,
                justification: 'center',
            });

            _newPlayerText.name = playerGroup.children[i].name;
            playerTextGroup.addChild(_newPlayerText);
        }


    }

    _obstacleGroup = data.obstacleGroup;

    if (_obstacleGroup[1].children != null) {
        for (var i = 0; i < _obstacleGroup[1].children.length; i++) {
            obstacleGroup.addChild(new Path(_obstacleGroup[1].children[i][1]));
        }
    }

    _fuelGroup = data.fuelGroup;

    if (_fuelGroup[1].children != null) {
        for (var i = 0; i < _fuelGroup[1].children.length; i++) {
            fuelGroup.addChild(new Path(_fuelGroup[1].children[i][1]));
        }
    }
    //console.log(data.player[1]);
    player = new Path(data.player[1]);

    /*    var tempVec = new Point({
            angle: -90,
            length: 5        
        })
    
        var playerName = new PointText({
            point: player.position.add(tempVec),
            content: player.name,
            fillColor: 'white',
            fontSize: 15,
            justification: 'center',
    //        visible: true
        });
        player.addChild(playerName);
    console.log(player.children);*/
    createVector(player, player);
    var tempVec = new Point({
        angle: -90,
        length: 45
    })
    var _newPlayerText = new PointText({
        point: player.position.add(tempVec),
        content: player.name,
        fillColor: 'white',
        fontSize: 15,
        justification: 'center',
    });

    _newPlayerText.name = player.name;
    playerTextGroup.addChild(_newPlayerText);


    /*    var tempVec = new Point({
            angle: -90,
            length: 45
        })
    
        player.data.nameText = new PointText({
            point: player.position.add(tempVec),
            content: player.name,
            fillColor: 'white',
            fontSize: 15,
            justification: 'center',
        });*/
    // player.fullySelected = 'true';
    view.center = player.position;
    scoreText.position = new Point(view.bounds.topLeft.x + view.bounds.width * 0.03, view.bounds.topLeft.y + view.bounds.height * 0.03);
    scoreValue.position = new Point(view.bounds.topLeft.x + view.bounds.width * 0.03, view.bounds.topLeft.y + view.bounds.height * 0.06);
    energyText.position = new Point(view.bounds.topLeft.x + view.bounds.width * 0.94, view.bounds.topLeft.y + view.bounds.height * 0.03);
    energyValue.position = new Point(view.bounds.topLeft.x + view.bounds.width * 0.94, view.bounds.topLeft.y + view.bounds.height * 0.06);
    energyValueText.position = new Point(view.bounds.topLeft.x + view.bounds.width * 0.94, view.bounds.topLeft.y + view.bounds.height * 0.09);
    leaveGameText.position = new Point(view.bounds.topLeft.x + view.bounds.width * 0.85, view.bounds.topLeft.y + view.bounds.height * 0.95);
    lowEnergyText.position = player.position.add(0, 50);
    showGroup(gameData);
    mainGameGroup.addChild(innerPath);
    mainGameGroup.addChild(outerPath);
    mainGameGroup.addChild(player);
    gameState = 2;


    createSymbols();


    //        console.log(symbol);
    //        console.log(project);



    view.attach('frame', game);
    //view.zoom=0.5;
    //    console.log("player");

}




var newPlayerFunc = function (newPlayer) {
    //console.log("new");
    var _newPlayer = new Path(newPlayer[1]);
    _newPlayer.data.vector = new Point({
        angle: newPlayer[1].data.angle,
        length: newPlayer[1].data.length
    });

    playerGroup.addChild(_newPlayer);

    var tempVec = new Point({
        angle: -90,
        length: 45
    })

    var _newPlayerText = new PointText({
        point: _newPlayer.position.add(tempVec),
        content: _newPlayer.name,
        fillColor: 'white',
        fontSize: 15,
        justification: 'center',
    });

    _newPlayerText.name = _newPlayer.name;
    playerTextGroup.addChild(_newPlayerText);


    //_newPlayer.data.nameText.position=_newPlayer.position.add(tempVec);
    //    console.log(_newPlayer);
    /*  playerGroup.addChild(_newPlayer);
      var tempVec = new Point({
          angle: -90,
          length: 45
      })
  
      playerGroup.children[_newPlayer.name].data.nameText = new PointText({
          point: playerGroup.children[_newPlayer.name].position.add(tempVec),
          content: _newPlayer.name,
          fillColor: 'white',
          fontSize: 15,
          justification: 'center',
      });
   */
};


var newFuelFunc = function (newFuel) {
    var _newFuel = new Path(newFuel[1]);
    fuelGroup.addChild(_newFuel);
};

var removeFuelFunc = function (fuelName) {
    fuelGroup.children[fuelName].remove();
}

var keyStateChangeFunc = function (_player) {
    if (player.data.unique == _player[1].data.unique) {
        player.segments = _player[1].segments;
        player.data = _player[1].data;
        createVector(player, _player[1]);

    } else {
        playerGroup.children[_player[1].name].segments = _player[1].segments;
        playerGroup.children[_player[1].name].data = _player[1].data;
        createVector(playerGroup.children[_player[1].name], _player[1]);
    }
}


var leavePlayerFunc = function (playerName) {
    if (playerGroup.children[playerName] != null)   // remove this
        playerGroup.children[playerName].remove();
    playerTextGroup.children[playerName].remove();
}

function left() {
    for (var i = 0; i < playerGroup.children.length; i++) {
        if (playerGroup.children[i].data.leftKey) {
            leftCalc(playerGroup.children[i]);
        }
    }

    if (player.data.leftKey) {
        leftCalc(player);
    }
}

function right() {
    for (var i = 0; i < playerGroup.children.length; i++) {
        if (playerGroup.children[i].data.rightKey) {
            rightCalc(playerGroup.children[i]);
        }
    }

    if (player.data.rightKey) {
        rightCalc(player);
    }
}

function forward() {
    for (var i = 0; i < playerGroup.children.length; i++) {
        if (playerGroup.children[i].data.upKey) {
            forwardCalc(playerGroup.children[i]);
        }
    }

    if (player.data.upKey) {
        forwardCalc(player);
    }
}

function reverse() {
    for (var i = 0; i < playerGroup.children.length; i++) {
        if (playerGroup.children[i].data.downKey) {
            reverseCalc(playerGroup.children[i]);
        }
    }

    if (player.data.downKey) {
        reverseCalc(player);
    }
}

function draw() {
    for (var i = 0; i < playerGroup.children.length; i++) {
        drawCalc(playerGroup.children[i]);
    }

    drawCalc(player);
    changeView();
    reduceEnergy(player.data.speed * 0.001); //energy loss due to speed
    energyValue.bounds.width = player.data.energy;
    energyValueText.content = Math.floor(player.data.energy);
    scoreValue.content = Math.floor(player.data.distance);

    if (player.data.energy < 21 && lowEnergyText.visible == false)
        lowEnergyText.visible = true;
    if (lowEnergyText.visible == true && player.data.energy > 20)
        lowEnergyText.visible = false;
    if (lowEnergyText.visible == true)
        lowEnergyText.position = player.position.add(0, 50);
}


function collision() {

    if (obstacleGroup.contains(player.position)) {
        reduceEnergy(5);
        player.data.vector.angle += 180;
        collisionCalc(player);
        player.data.length = player.data.vector.length;
        player.data.angle = player.data.vector.angle;
        socket.emit('keyStateChange', player);
        collisionDelay = 10;
    }

    if (fuelGroup.contains(player.position)) {
        gainEnergy(10)
        for (var i = 0; i < fuelGroup.children.length; i++) {
            if (fuelGroup.children[i].contains(player.position)) {
                socket.emit('removeFuel', fuelGroup.children[i].name);
                fuelGroup.children[i].remove();
            }
        }
    }


    if (playerGroup.intersects(player)) {
        for (var i = 0; i < playerGroup.children.length; i++) {
            if (playerGroup.children[i].intersects(player)) {

                if (player.data.speed > playerGroup.children[i].data.speed) {
                    var tempAngle = player.data.vector.angle
                    var tempLength = player.data.vector.length
                    var tempSpeed = player.data.speed

                    player.data.vector.angle = playerGroup.children[i].data.vector.angle;
                    player.data.vector.length = playerGroup.children[i].data.vector.length;
                    player.data.speed = playerGroup.children[i].data.speed;

                    gainEnergy(10);

                    playerGroup.children[i].data.vector.angle = tempAngle;
                    playerGroup.children[i].data.vector.length = tempLength;
                    playerGroup.children[i].data.speed = tempSpeed;

                    playerGroup.children[i].data.angle = tempAngle;
                    playerGroup.children[i].data.length = tempLength;

                    playerGroup.children[i].data.energy = Math.max(playerGroup.children[i].data.energy - 10, 0)

                    socket.emit('collision', playerGroup.children[i]);

                    player.data.length = player.data.vector.length;
                    player.data.angle = player.data.vector.angle;
                    socket.emit('keyStateChange', player);
                    collisionDelay = 10;

                }
            }
        }
    }




    if (outerPath.intersects(player)) {
        var intersection = outerPath.getIntersections(player)
        var tangent = 0;
        for (var i = 0; i < intersection.length; i++) {
            tangent += intersection[i].tangent.angle;
        }
        tangent /= intersection.length;
        var angle = -player.data.vector.angle;
        angle = angle + 2 * tangent;
        player.data.vector.angle = angle;
        collisionCalc(player);
        reduceEnergy(5);
        player.data.length = player.data.vector.length;
        player.data.angle = player.data.vector.angle;
        socket.emit('keyStateChange', player);

        collisionDelay = 10;
    }

    if (innerPath.intersects(player)) {
        var intersection = innerPath.getIntersections(player)
        var tangent = 0;
        for (var i = 0; i < intersection.length; i++) {
            tangent += intersection[i].tangent.angle;
        }
        tangent /= intersection.length;
        var angle = -player.data.vector.angle;
        angle = angle + 2 * tangent;
        player.data.vector.angle = angle;
        collisionCalc(player);
        player.data.length = player.data.vector.length;
        player.data.angle = player.data.vector.angle;
        socket.emit('keyStateChange', player);
        reduceEnergy(5);
        collisionDelay = 10;
    }
}

function onKeyDown(event) {
    if (event.key == 'escape') {
        if (gameState == 2) {
            leaveGameText.visible = true;
            gameState = 3;
        } else if (gameState == 3) {
            endGame();
            gameState = 1;
        }
    }
    if (event.key == 'c') {
        if (gameState = 3) {
            leaveGameText.visible = false;
            gameState = 2;
        }
    }
}

function endGame() {
    socket.emit('leavePlayer', player);
    socket.removeAllListeners();
    leaveGameText.visible = false;
    fuelGroup.removeChildren();
    playerGroup.removeChildren();
    playerTextGroup.removeChildren();
    player.remove();
    innerPath.remove();
    outerPath.remove();
    hideGroup(gameData);
    removeSymbols();
    view.detach('frame', game);
    view.center = startScreenCenter;
    createSymbols();
    view.attach('frame', symbolAnim);
    highScore.content = '';
    socket.emit('getHighScore');
    showGroup(startScreen);
}

var keyStateChange = 0;


var game = function (event) {
    if (Key.isDown('a') && player.data.leftKey == 0) {
        player.data.leftKey = 1;
        keyStateChange = 1;
    }
    if (!Key.isDown('a') && player.data.leftKey == 1) {
        player.data.leftKey = 0;
        keyStateChange = 1;
    }

    if (Key.isDown('d') && player.data.rightKey == 0) {
        player.data.rightKey = 1;
        keyStateChange = 1;
    }
    if (!Key.isDown('d') && player.data.rightKey == 1) {
        player.data.rightKey = 0;
        keyStateChange = 1;
    }

    if (Key.isDown('w') && player.data.upKey == 0) {
        player.data.upKey = 1;
        keyStateChange = 1;
    }
    if (!Key.isDown('w') && player.data.upKey == 1) {
        player.data.upKey = 0;
        keyStateChange = 1;
    }

    if (Key.isDown('s') && player.data.downKey == 0) {
        player.data.downKey = 1;
        keyStateChange = 1;
    }
    if (!Key.isDown('s') && player.data.downKey == 1) {
        player.data.downKey = 0;
        keyStateChange = 1;
    }
    if (keyStateChange) {
        player.data.length = player.data.vector.length;
        player.data.angle = player.data.vector.angle;
        socket.emit('keyStateChange', player);
        keyStateChange = 0;
    }
    left();
    right();
    forward();
    reverse();
    draw();
    if (collisionDelay == 0)
        collision();
    else
        collisionDelay--;
}




/*helper functions*/

function leftCalc(object) {
    var data = object.data;
    if (data.speed >= 0.01) {
        if (data.speed < 3 && data.speed >= 0) {
            data.vector.angle -= (data.speed * 2);
        } else {
            data.vector.angle -= data.maxSteer * data.steering;
        }
        data.speed *= data.friction;
    }
}

function rightCalc(object) {
    var data = object.data;
    if (data.speed >= 0.01) {
        if (data.speed < 3 && data.speed >= 0) {
            data.vector.angle += (data.speed * 2);
        } else {
            data.vector.angle += data.maxSteer * data.steering;
        }
        data.speed *= data.friction;
    }
}

function forwardCalc(object) {
    var data = object.data;
    data.speed += 0.3;
    data.speed = Math.min(data.maxSpeed, data.speed);
}

function reverseCalc(object) {
    var data = object.data;
    data.speed -= 0.3;
    data.speed = Math.max(data.minSpeed, data.speed);
}

var textVec = new Point({
    angle: -90,
    length: 45
})

function drawCalc(object) {
    var data = object.data;
    var vec = data.vector.normalize(Math.abs(data.speed));
    data.distance += data.speed * 0.001;
    data.speed = data.speed * data.friction;
    object.position = object.position.add(vec);
    //    console.log(playerGroup.children[object.name]);
    playerTextGroup.children[object.name].position = object.position.add(textVec);
    //    object.data.nameText.point = object.data.nameText.point.add(vec);
    //    object.data.position = object.position;
    object.rotate(data.vector.angle - data.previousAngle);
    data.previousAngle = data.vector.angle;
    vec = data.vector.normalize((data.speed - data.previousSpeed));
    object.segments[0].point = object.segments[0].point.subtract(vec);
    object.smooth();
    data.previousSpeed = data.speed;
}



function createVector(object1, object2) {
    object1.data.vector = new Point({
        angle: object2.data.angle,
        length: object2.data.length
    })
}

function changeView() {
    var data = player.data;
    var vec = data.vector.normalize(Math.abs(data.speed * 0.97));
    view.center = view.center.add(vec);

    for (var i = 0; i < gameData.children.length; i++)
        gameData.children[i].position = gameData.children[i].position.add(vec);
    leaveGameText.position = leaveGameText.position.add(vec);
    //    console.log(view.bounds.topLeft);
    /*    view.center = player.position;*/

    //vec.angle +=180;
    for (var i = 0; i < placedSymbols.length; i++) {
        var item = placedSymbols[i];
        var size = item.bounds.size;
        var length = vec.length / 1.5 * size.width / 10;
        item.position += vec.normalize(length) + item.data.vector;
        keepInView(item);
    }

}

function keepInView(item) {
    var position = item.position;
    var viewBounds = view.bounds;
    if (position.isInside(viewBounds))
        return;
    var itemBounds = item.bounds;
    if (position.x > viewBounds.x + viewBounds.width + 5) {
        position.x = viewBounds.x - 5;
    }

    if (position.x < viewBounds.x - 5) {
        position.x = viewBounds.x + viewBounds.width + 5;
    }

    if (position.y > viewBounds.y + viewBounds.height + 5) {
        position.y = viewBounds.y - 5;
    }

    if (position.y < viewBounds.y - 5) {
        position.y = viewBounds.y + viewBounds.height + 5;
    }
}

function reduceEnergy(value) {
    player.data.energy = Math.max(player.data.energy - value, 0); //energy loss 
    if (player.data.energy == 0) {
        endGame();
        //location.reload()
    }
}

function gainEnergy(value) {
    player.data.energy = Math.min(player.data.energy + value, 100); //energy loss 
}

function collisionCalc(object) {
    var data = object.data;
    data.speed *= 0.2;
    data.speed = Math.max(data.minSpeed, data.speed);
}