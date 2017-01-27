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
    playerGroup.addChild(new Path(newPlayer[1]));
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
    }
}

var game = function (event) {
    if (Key.isDown('left') && player.data.leftKey == 0) {
        player.data.leftKey = 1;
    }
    if (!Key.isDown('left') && player.data.leftKey == 1) {
        player.data.leftKey = 0;
    }

    if (Key.isDown('right') && player.data.rightKey == 0) {
        player.data.rightKey = 1;
    }
    if (!Key.isDown('right') && player.data.rightKey == 1) {
        player.data.rightKey = 0;
    }

    if (Key.isDown('up') && player.data.upKey == 0) {
        player.data.upKey = 1;
    }
    if (!Key.isDown('up') && player.data.upKey == 1) {
        player.data.upKey = 0;
    }

    if (Key.isDown('down') && player.data.downKey == 0) {
        player.data.downKey = 1;
    }
    if (!Key.isDown('down') && player.data.downKey == 1) {
        player.data.downKey = 0;
    }
    left();
    right();
    forward();
    reverse();
    draw();
}

/*view.onFrame = function(event) {
	if (Key.isDown('left'))
		player.left();

	if (Key.isDown('right'))
		player.right();

	if (Key.isDown('up'))
		player.forward();

	if (Key.isDown('down'))
		player.reverse();
player.draw();
}

var player = new function () {
    var circle = new Path.Circle({
        center: new paper.Point(300, 300),
        radius: 15,
        strokeColor: 'white',
        fillColor: 'white'
    }
    );

    var vector = new Point({
        angle: 0,
        length: 20
    })

    var speed = 0;
    var maxSteer = 4.5;
    var friction = 0.98;
    var steering = 1.5;
    var maxSpeed = 100;
    var minSpeed = 1;

    return {
        left: function () {
            if (speed >= 0.01) {
                if (speed < 3 && speed >= 0) {
                    vector.angle -= (speed * 2);
                } else {
                    vector.angle -= maxSteer * steering;
                }
                speed *= friction;
            }
        },

        right: function () {
            if (speed >= 0.01) {
                if (speed < 3 && speed >= 0) {
                    vector.angle += (speed * 2);
                } else {
                    vector.angle += maxSteer * steering;
                }
                speed *= friction;
            }
        },

        forward: function () {
            speed += 0.3;
            speed = Math.min(maxSpeed, speed);
        },

        reverse: function () {
            speed -= 0.3;
            if (speed < minSpeed)
                speed = minSpeed;
        },
        draw: function () {
            var vec = vector.normalize(Math.abs(speed));
            speed = speed * friction;
            circle.position = circle.position.add(vec);
        }
    }




}
*/