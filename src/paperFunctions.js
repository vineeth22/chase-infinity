var paper = require('paper');
new paper.Project();
var obstacleGroup = new paper.Group();
var fuelGroup = new paper.Group();
//var test = new paper.Group();
//test.addChild(new paper.Path(0,0));
//console.log(test.children[0]);
//test.children[0].remove();
//console.log(test.children[0]);

var playerGroup = new paper.Group();

var outerPath;
var innerPath;

function initGame() {
    outerPath = new paper.Path('M 161.58115,565.20505 C 64.355312,574.70942 133.24002,506.92685 142.11527,386.9022 129.07995,235.19876 51.176742,38.335505 252.50797,107.15801 373.70758,134.63368 655.04347,-7.5133049 603.45073,157.21212 575.01702,263.13976 577.69744,232.36252 591.34737,426.09909 621.47992,641.18704 327.6762,559.35278 161.58115,565.20505 Z');
    outerPath.strokeColor = 'red';
    outerPath.strokeWidth = 2;
    //outerPath.smooth();

    innerPath = new paper.Path('m 207.97594,514.48175 c -75.17639,7.34891 -21.91376,-45.06154 -15.05129,-137.86633 -10.0791,-117.29923 -70.31496,-269.51672 85.35721,-216.30217 93.71327,21.24458 311.2462,-88.665501 271.35395,38.70255 -21.98535,81.90476 -19.91282,58.10737 -9.35849,207.90721 23.29892,166.3091 -203.8743,103.03367 -332.30138,107.55874 z');
    innerPath.strokeColor = 'red';
    innerPath.strokeWidth = 2;
    // innerPath.smooth();

    var innerPathScaleFactor = 0.945;
//    innerPath.fullySelected = true;
    var outerPathScaleFactor = 40;
    outerPath.scale(outerPathScaleFactor, new paper.Point(0, 0));
    innerPath.bounds = outerPath.bounds;
    innerPath.scale(innerPathScaleFactor);

    
    var obstacleCount = 0;



    for (var i = 0; i < obstacleCount; i++) {
        var point = paper.Point.random().multiply(outerPath.bounds.bottomRight);
        while (innerPath.contains(point) || !outerPath.contains(point)) {
            point = paper.Point.random().multiply(outerPath.bounds.bottomRight);
        }

        var obstacle = new paper.Path.Circle({
            center: point,
            radius: 40,
            fillColor: 'red'
        }
        );
        obstacle.name = "obstacle";
        var num = Math.random() * 1000;
        num = num.toString();
        obstacle.name = obstacle.name.concat(num);
        obstacleGroup.addChild(obstacle);
    }

    var fuelCount = 40;

    for (var i = 0; i < fuelCount; i++) {
        var point = paper.Point.random().multiply(outerPath.bounds.bottomRight);
        while (innerPath.contains(point) || !outerPath.contains(point)) {
            point = paper.Point.random().multiply(outerPath.bounds.bottomRight);
        }
        var fuel = new paper.Path.Circle({
            center: point,
            radius: 25,
            fillColor: 'blue',
            //opacity:0.9
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
    var point = paper.Point.random().multiply(outerPath.bounds.bottomRight);
    while (innerPath.contains(point) || !outerPath.contains(point)) {
        point = paper.Point.random().multiply(outerPath.bounds.bottomRight);
    }

    var newPlayer = new paper.Path.Ellipse({
        point: point,
        size: [50, 50],
        fillColor: 'yellow'
    });

    newPlayer.data.unique = Math.random() * 1000;
    newPlayer.name = name;
    newPlayer.data.speed = 0;
    newPlayer.data.previousSpeed = 0;
    newPlayer.data.distance = 0;
    newPlayer.data.maxSteer = 4.5;
    newPlayer.data.friction = 0.99;
    newPlayer.data.steering = 0.8;
    newPlayer.data.maxSpeed = 50;
    newPlayer.data.minSpeed = 1;
    newPlayer.data.leftKey = 0;
    newPlayer.data.rightKey = 0;
    newPlayer.data.upKey = 0;
    newPlayer.data.downKey = 0;
    newPlayer.data.angle = 0;
    newPlayer.data.previousAngle = 0;
    newPlayer.data.length = 20;
    newPlayer.data.energy = 100;
    newPlayer.data.vector = new paper.Point({
        angle: newPlayer.data.angle,
        length: newPlayer.data.length
    });

    var tempVec = new paper.Point({
        angle: -90,
        length: 5
    })

    var playerName = new paper.PointText({
        point: newPlayer.position.add(tempVec),
        content: newPlayer.name,
        fillColor: 'white',
        fontSize: 15,
        justification: 'center',
        //        visible: true
    });
    //newPlayer.addChild(playerName);

    func(newPlayer, playerGroup, outerPath, innerPath, obstacleGroup, fuelGroup);
    playerGroup.addChild(newPlayer);

}

function removePlayer(playerName, func) {
    //console.log('removed');
    if (playerGroup.children[playerName] != null) {
        console.log(playerGroup.children[playerName].data.distance);
        func(playerGroup.children[playerName].data.distance);
        playerGroup.children[playerName].remove();
    }
    else (func(null));

    // console.log(playerGroup.children[playerName]);
    //     console.log(playerGroup.children[playerName]);
}

function keyStateChange(player) {
    if (playerGroup.children[player[1].name]) {
        playerGroup.children[player[1].name].segments = player[1].segments;
        playerGroup.children[player[1].name].data = player[1].data;
        playerGroup.children[player[1].name].data.vector = new paper.Point({
            angle: player[1].data.angle,
            length: player[1].data.length
        });
    }
}


function removeFuel(fuelName) {
    if (fuelGroup.children[fuelName])
        fuelGroup.children[fuelName].remove();
}

function newFuel(func) {
    var point = paper.Point.random().multiply(outerPath.bounds.bottomRight);
    while (innerPath.contains(point) || !outerPath.contains(point)) {
        point = paper.Point.random().multiply(outerPath.bounds.bottomRight);
    }
    var fuel = new paper.Path.Circle({
        center: point,
        radius: 25,
        fillColor: 'blue'
    });
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



/*

innerPath = m 289.26941,227.14575 c 39.87183,3.77281 78.06496,-9.5195 110.03649,-23.9064 42.68867,-20.4126 81.93727,-50.44436 84.62974,-86.80073 1.40952,-21.560188 -15.0261,-42.049381 -38.2725,-56.571224 C 376.96155,55.810493 308.2986,38.234401 238.98522,48.921341 208.59619,52.913395 180.92781,62.493369 154.00789,72.181047 116.04524,82.051618 69.577539,74.526145 36.205494,92.334011 11.338265,107.83815 14.21371,132.79458 18.415398,153.2442 c 3.546462,14.41521 9.453873,28.46978 10.876104,43.08797 5.007049,21.08719 13.041943,46.52997 44.33457,57.32799 33.634048,9.42942 69.438548,-1.34816 101.198418,-9.13316 36.41753,-8.78007 74.48396,-22.98044 114.44492,-17.38125 z


outerPath = m 289.26941,227.14575 c 39.87183,3.77281 78.06496,-9.5195 110.03649,-23.9064 42.68867,-20.4126 81.93727,-50.44436 84.62974,-86.80073 1.40952,-21.560188 -15.0261,-42.049381 -38.2725,-56.571224 C 376.96155,55.810493 308.2986,38.234401 238.98522,48.921341 208.59619,52.913395 180.92781,62.493369 154.00789,72.181047 116.04524,82.051618 69.577539,74.526145 36.205494,92.334011 11.338265,107.83815 14.21371,132.79458 18.415398,153.2442 c 3.546462,14.41521 9.453873,28.46978 10.876104,43.08797 5.007049,21.08719 13.041943,46.52997 44.33457,57.32799 33.634048,9.42942 69.438548,-1.34816 101.198418,-9.13316 36.41753,-8.78007 74.48396,-22.98044 114.44492,-17.38125 z
 */