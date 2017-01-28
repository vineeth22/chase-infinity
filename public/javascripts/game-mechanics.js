var score = new PointText({
    point: [5, 15],
    content: 'Score',
    fillColor: 'white',
    fontSize: 12
});

var playerGroup = new Group();
var player;
socket.emit('newPlayer');

// takes the game state from the server
socket.on('gameState', function (data) {
    _playerGroup = data.playerGroup;

    if (_playerGroup[1].children != null) {
        for (var i = 0; i < _playerGroup[1].children.length; i++) {
            playerGroup.addChild(new Path(_playerGroup[1].children[i][1]));
        }
        for (var i = 0; i < playerGroup.children.length; i++) {
            createVector(playerGroup.children[i], playerGroup.children[i]);
        }
    }

    player = new Path(data.player[1]);
    createVector(player, player);
    view.on('frame', game);
});

//adds a new player joined during game play
socket.on('newPlayer', function (newPlayer) {
    var _newPlayer = new Path(newPlayer[1]);
    _newPlayer.data.vector = new Point({
        angle: newPlayer[1].data.angle,
        length: newPlayer[1].data.length
    });
    playerGroup.addChild(_newPlayer);
})

//receives position and keypress of other players from server
socket.on('keyStateChange', function (_player) {
    playerGroup.children[_player[1].name].segments = _player[1].segments;
    playerGroup.children[_player[1].name].data = _player[1].data;
    createVector(playerGroup.children[_player[1].name], _player[1]);
})

//removes leaving player from the game
socket.on('leavePlayer', function (playerName) {
    if(playerGroup.children[playerName] != null)   // remove this
    playerGroup.children[playerName].remove();
})

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
}

var keyStateChange = 0;

var game = function (event) {
    if (Key.isDown('left') && player.data.leftKey == 0) {
        player.data.leftKey = 1;
        keyStateChange = 1;
    }
    if (!Key.isDown('left') && player.data.leftKey == 1) {
        player.data.leftKey = 0;
        keyStateChange = 1;
    }

    if (Key.isDown('right') && player.data.rightKey == 0) {
        player.data.rightKey = 1;
        keyStateChange = 1;
    }
    if (!Key.isDown('right') && player.data.rightKey == 1) {
        player.data.rightKey = 0;
        keyStateChange = 1;
    }

    if (Key.isDown('up') && player.data.upKey == 0) {
        player.data.upKey = 1;
        keyStateChange = 1;
    }
    if (!Key.isDown('up') && player.data.upKey == 1) {
        player.data.upKey = 0;
        keyStateChange = 1;
    }

    if (Key.isDown('down') && player.data.downKey == 0) {
        player.data.downKey = 1;
        keyStateChange = 1;
    }
    if (!Key.isDown('down') && player.data.downKey == 1) {
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

function drawCalc(object) {
    var data = object.data;
    var vec = data.vector.normalize(Math.abs(data.speed));
    data.distance += data.speed * 0.001;
    score.content=data.distance;
    data.speed = data.speed * data.friction;
    object.position = object.position.add(vec);
    object.data.position = object.position;
}

function createVector(object1, object2) {
    object1.data.vector = new Point({
        angle: object2.data.angle,
        length: object2.data.length
    })
}