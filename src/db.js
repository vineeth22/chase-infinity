var MongoClient = require('mongodb').MongoClient
    , assert = require('assert');

var request = require('./request.js');

var megaConversion = 0.2;

/*var winston = require('winston');

var logger = new (winston.Logger)({
    transports: [
        new (winston.transports.Console)(),
    ]
});

logger.level = 'debug';*/

// Connection URL
//var url = 'mongodb://127.0.0.1:27017/chase';
var url = 'mongodb://127.0.0.1:27017/chase';


// Use connect method to connect to the server
/*
MongoClient.connect(url, function(err, db) {
  assert.equal(null, err);
});
*/


function getUserData(username, func) {
    var object = new Object();
    object.username = username;
    MongoClient.connect(url, function (err, db) {
        assert.equal(null, err);
        //        logger.log('info', "Connected successfully to server");
        db.collection('game').find(object).toArray(function (err, r) {
            if (!r || r.length == 0) {    //user playing for the first time
                var object = new Object();
                object.username = username;
                object.score = 0;
                object.level = 0;
                db.collection('game').insertOne(object, function (err, r) {
                    assert.equal(1, r.insertedCount);
                    //                   logger.log('info', "New user %s logged in", username);
                    db.close();
                });
                func(object);
            }
            else if (r.length == 1) {
                func(r[0]);
                //                logger.log('info', "User %s logged in", username);
            }
            else {
                func("Error");
            }
        });
    });
}

function putUserData(username, score) {
    getUserData(username, function (data) {
        if (data.score < score) {
            var find = new Object();
            find.username = username;
            findLevel(score, function (level) {
                var update = new Object();
                update.score = Math.floor(score);
                update.level = level;
                MongoClient.connect(url, function (err, db) {
                    assert.equal(null, err);
                    db.collection('game').findOneAndUpdate(find, { $set: update }, function (err, r) {
                        assert.equal(null, err);
                    })
                    db.close();
                })
            })

            request.updateScore("chaseInfinity", score, username,function (ret) {
                
            });
        }
        findLevel(score, function (level) {
            var object = new Object();
            object.username = username;
            object.score = Math.floor(score);
            object.level = level;
            MongoClient.connect(url, function (err, db) {
                assert.equal(null, err);
                db.collection('mega').insertOne(object, function (err, r) {
                    assert.equal(1, r.insertedCount);
                })
                db.close();
            })
        });
        request.getMega(username, function (oldScore) {
            var newScore = oldScore + megaConversion * score;
            request.updateMega(username,Math.floor(newScore),function (ret) {
                
            })
        });
    })
}


function findLevel(score, func) {
    var n1 = 50;        //n1 will hold value of n1 and n2 of level 1 
    var n2 = 50;
    var temp;
    var level = 1;
    while (n2 < score) {
        temp = n2;
        n2 += n1;
        n1 = n2;
        level++;
    }
    func(level);
}

function getLeaderboard(func) {
    MongoClient.connect(url, function (err, db) {
        assert.equal(null, err);
        db.collection('game').find().sort({ score: -1 }).limit(8).toArray(function (err, r) {
            func(r);
        });
    });
}

/*
getUserData("hel", function (user) {
    console.log(user);
});
*/

//putUserData("vi")
//getHighScore();

module.exports.getUserData = getUserData;
module.exports.putUserData = putUserData;
module.exports.getLeaderboard = getLeaderboard;