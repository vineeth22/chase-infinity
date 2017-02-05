var paper = require('paper');
new paper.Project();
var obstacleGroup = new paper.Group();
var fuelGroup = new paper.Group();

var playerGroup = new paper.Group();

var outerPath;
var innerPath;

function initGame() {
    outerPath = new paper.Path('m 289.26941,227.14575 c 39.87183,3.77281 78.06496,-9.5195 110.03649,-23.9064 42.68867,-20.4126 81.93727,-50.44436 84.62974,-86.80073 1.40952,-21.560188 -15.0261,-42.049381 -38.2725,-56.571224 C 376.96155,55.810493 308.2986,38.234401 238.98522,48.921341 208.59619,52.913395 180.92781,62.493369 154.00789,72.181047 116.04524,82.051618 69.577539,74.526145 36.205494,92.334011 11.338265,107.83815 14.21371,132.79458 18.415398,153.2442 c 3.546462,14.41521 9.453873,28.46978 10.876104,43.08797 5.007049,21.08719 13.041943,46.52997 44.33457,57.32799 33.634048,9.42942 69.438548,-1.34816 101.198418,-9.13316 36.41753,-8.78007 74.48396,-22.98044 114.44492,-17.38125 z');
    outerPath.strokeColor = 'white';
    outerPath.strokeWidth = 2;
    outerPath.smooth();

    innerPath = new paper.Path('m 289.26941,227.14575 c 39.87183,3.77281 78.06496,-9.5195 110.03649,-23.9064 42.68867,-20.4126 81.93727,-50.44436 84.62974,-86.80073 1.40952,-21.560188 -15.0261,-42.049381 -38.2725,-56.571224 C 376.96155,55.810493 308.2986,38.234401 238.98522,48.921341 208.59619,52.913395 180.92781,62.493369 154.00789,72.181047 116.04524,82.051618 69.577539,74.526145 36.205494,92.334011 11.338265,107.83815 14.21371,132.79458 18.415398,153.2442 c 3.546462,14.41521 9.453873,28.46978 10.876104,43.08797 5.007049,21.08719 13.041943,46.52997 44.33457,57.32799 33.634048,9.42942 69.438548,-1.34816 101.198418,-9.13316 36.41753,-8.78007 74.48396,-22.98044 114.44492,-17.38125 z');
    innerPath.strokeColor = 'white';
    innerPath.strokeWidth = 2;
    innerPath.smooth();

    var innerPathScaleFactor = 0.4;
    var outerPathScaleFactor = 10;
    outerPath.scale(outerPathScaleFactor, new paper.Point(0, 0));
    innerPath.bounds = outerPath.bounds;
    innerPath.scale(innerPathScaleFactor);

    var obstacleCount = 20;

    for (var i = 0; i < obstacleCount; i++) {
        var obstacle = new paper.Path.Circle({
            center: new paper.Point(Math.random() * outerPath.bounds.width, Math.random() * outerPath.bounds.height),
            radius: 40,
            fillColor: 'red'
        }
        );
        obstacle.name = Math.random() * 1000;
        obstacleGroup.addChild(obstacle);
    }

    var fuelCount = 20;

    for (var i = 0; i < fuelCount; i++) {
        var fuel = new paper.Path.Circle({
            center: new paper.Point(Math.random() * outerPath.bounds.width, Math.random() * outerPath.bounds.height),
            radius: 40,
            fillColor: 'white'
        }
        );
        fuel.name = "fuel";
        var num = Math.random() * 1000;
        num = num.toString();
        fuel.name = fuel.name.concat(num);
        fuelGroup.addChild(fuel);
    }

}

function getNewPlayer(name, func) {
    /*    var newPlayer = new paper.Path.Circle({
            center: new paper.Point(900, 900),
            radius: 20,
            fillColor: new paper.Color(Math.random(), Math.random(), Math.random())
        }
        );*/

    var newPlayer = new paper.Path.Ellipse({
        point: [900, 900],
        size: [80, 60],
        fillColor: new paper.Color(Math.random(), Math.random(), Math.random())
    });

    newPlayer.data.unique = Math.random() * 1000;
    newPlayer.name = name;
    newPlayer.data.speed = 5;
    newPlayer.data.distance = 0;
    newPlayer.data.maxSteer = 4.5;
    newPlayer.data.friction = 0.99;
    newPlayer.data.steering = 0.5;
    newPlayer.data.maxSpeed = 50;
    newPlayer.data.minSpeed = 0.5;
    newPlayer.data.leftKey = 0;
    newPlayer.data.rightKey = 0;
    newPlayer.data.upKey = 0;
    newPlayer.data.downKey = 0;
    newPlayer.data.angle = 0;
    newPlayer.data.previousAngle = 0;
    newPlayer.data.length = 20;
    newPlayer.data.vector = new paper.Point({
        angle: newPlayer.data.angle,
        length: newPlayer.data.length
    });



    func(newPlayer, playerGroup, outerPath, innerPath, obstacleGroup, fuelGroup);
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


function removeFuel(fuelName) {
    fuelGroup.children[fuelName].remove();
}

function newFuel(func) {
    var fuel = new paper.Path.Circle({
        center: new paper.Point(Math.random() * outerPath.bounds.width, Math.random() * outerPath.bounds.height),
        radius: 40,
        fillColor: 'white'
    }
    );
    fuel.name = "fuel";
    var num = Math.random() * 1000;
    num = num.toString();
    fuel.name = fuel.name.concat(num);
    fuelGroup.addChild(fuel);
    func(fuel);
}

module.exports.initGame = initGame;
module.exports.getNewPlayer = getNewPlayer;
module.exports.removePlayer = removePlayer;
module.exports.keyStateChange = keyStateChange;
module.exports.removeFuel = removeFuel;
module.exports.newFuel = newFuel;