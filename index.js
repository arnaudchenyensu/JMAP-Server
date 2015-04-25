var db = require('./db.js');

var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var Promise = require('bluebird');

app.use(bodyParser.json());

app.post('/', function (req, res) {
    var results = [];
    var promises = [];

    req.body.forEach(function (message) {
        // TODO check req.body and message are valid data
        var method = message[0],
            args = message[1],
            callId = message[2];
        promises.push(db[method](results, args, callId));
    });

    Promise.all(promises).then(function () {
        res.json(results);
    }).catch(function (err) {
        console.log(err);
    });
});

var server = app.listen(3000, function () {
    var host = server.address().address;
    var port = server.address().port;

    console.log('Listening at http://%s:%s', host, port);
});

