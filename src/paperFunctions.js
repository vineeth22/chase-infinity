var paper = require('paper');
new paper.Project();
var playerGroup = new paper.Group();
//playerGroup.name = 'playerGroup';
//    var playersLayer = new paper.Layer();
//    playersLayer.activate();
//    console.log(paper.project.activeLayer);


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
    newPlayer.data.position = newPlayer.position;
    playerGroup.addChild(newPlayer);
    func(newPlayer, playerGroup);
}

function removePlayer(playerName) {
    if(playerGroup.children[playerName] != null)    //change this
    playerGroup.children[playerName].remove();
}

module.exports.getNewPlayer = getNewPlayer;
module.exports.removePlayer = removePlayer;