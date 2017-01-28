var paper = require('paper');
new paper.Project();
var playerGroup = new paper.Group();

function getNewPlayer(name, func) {
    var newPlayer = new paper.Path.Circle({
        center: new paper.Point(300, 300),
        radius: 15,
        strokeColor: 'white',
        fillColor: 'white'
    }
    );


    newPlayer.name = name;
    newPlayer.data.speed = 1;
    newPlayer.data.distance = 0;
    newPlayer.data.maxSteer = 4.5;
    newPlayer.data.friction = 0.98;
    newPlayer.data.steering = 1.5;
    newPlayer.data.maxSpeed = 100;
    newPlayer.data.minSpeed = 0;
    newPlayer.data.leftKey = 0;
    newPlayer.data.rightKey = 0;
    newPlayer.data.upKey = 0;
    newPlayer.data.downKey = 0;
    newPlayer.data.angle = 0;
    newPlayer.data.length = 20;
    newPlayer.data.vector = new paper.Point({
        angle: newPlayer.data.angle,
        length: newPlayer.data.length
    });
    func(newPlayer, playerGroup);
    playerGroup.addChild(newPlayer);
    
}

function removePlayer(playerName) {
    if (playerGroup.children[playerName] != null)    //change this
        playerGroup.children[playerName].remove();
}

function keyStateChange(player) {
    playerGroup.children[player[1].name].segments = player[1].segments;
    playerGroup.children[player[1].name].data = player[1].data;
    playerGroup.children[player[1].name].data.vector = new paper.Point({
        angle: player[1].data.angle,
        length: player[1].data.length
    });
}

module.exports.getNewPlayer = getNewPlayer;
module.exports.removePlayer = removePlayer;
module.exports.keyStateChange = keyStateChange;