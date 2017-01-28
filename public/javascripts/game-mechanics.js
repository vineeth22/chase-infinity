var playerGroup = new Group();
var player;
socket.emit('newPlayer');


socket.on('playerGroup', function (_playerGroup) {
    _playerGroup = JSON.parse(_playerGroup);
    for (var i = 0; i < _playerGroup[1].children.length; i++) {
        playerGroup.addChild(new Path(_playerGroup[1].children[i][1]));
    }
    for (var i = 0; i < playerGroup.children.length; i++) {
        playerGroup.children[i].data.vector = new Point({
            angle: playerGroup.children[i].data.angle,
            length: playerGroup.children[i].data.length
        });
    }
    player = playerGroup.children[socket.id];
    view.on('frame', game);
});
socket.on('newPlayer', function (newPlayer) {
    newPlayer = JSON.parse(newPlayer);
    var _newPlayer = new Path(newPlayer[1]);
    _newPlayer.data.vector = new Point({
        angle: newPlayer[1].data.angle,
        length: newPlayer[1].data.length
    });
    playerGroup.addChild(_newPlayer);
})
socket.on('keyStateChange', function (_player) {
    _player = JSON.parse(_player);
    playerGroup.children[_player[1].name].segments = _player[1].segments;
    playerGroup.children[_player[1].name].data = _player[1].data;
    playerGroup.children[_player[1].name].data.vector = new Point({
        angle: _player[1].data.angle,
        length: _player[1].data.length
    });
})
socket.on('leavePlayer', function (playerName) {
    playerGroup.children[playerName].remove();
})




function left() {
    for (var i = 0; i < playerGroup.children.length; i++) {
        if (playerGroup.children[i].data.leftKey) {
            var data = playerGroup.children[i].data;
            if (data.speed >= 0.01) {
                if (data.speed < 3 && data.speed >= 0) {
                    data.vector.angle -= (data.speed * 2);
                } else {
                    data.vector.angle -= data.maxSteer * data.steering;
                }
                data.speed *= data.friction;
            }
        }
    }
}

function right() {
    for (var i = 0; i < playerGroup.children.length; i++) {
        if (playerGroup.children[i].data.rightKey) {
            var data = playerGroup.children[i].data;
            if (data.speed >= 0.01) {
                if (data.speed < 3 && data.speed >= 0) {
                    data.vector.angle += (data.speed * 2);
                } else {
                    data.vector.angle += data.maxSteer * data.steering;
                }
                data.speed *= data.friction;
            }
        }
    }
}

function forward() {
    for (var i = 0; i < playerGroup.children.length; i++) {
        if (playerGroup.children[i].data.upKey) {
            var data = playerGroup.children[i].data;
            data.speed += 0.3;
            data.speed = Math.min(data.maxSpeed, data.speed);
        }
    }
}

function reverse() {
    for (var i = 0; i < playerGroup.children.length; i++) {
        if (playerGroup.children[i].data.downKey) {
            var data = playerGroup.children[i].data;
            data.speed -= 0.3;
            data.speed = Math.max(data.minSpeed, data.speed);
        }
    }
}

function draw() {
    for (var i = 0; i < playerGroup.children.length; i++) {
        var data = playerGroup.children[i].data;
        var vec = data.vector.normalize(Math.abs(data.speed));
        data.speed = data.speed * data.friction;
        playerGroup.children[i].position = playerGroup.children[i].position.add(vec);
        playerGroup.children[i].data.position = playerGroup.children[i].position;
    }
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
        socket.emit('keyStateChange', JSON.stringify(player));
        keyStateChange = 0;
    }
    left();
    right();
    forward();
    reverse();
    draw();
}
