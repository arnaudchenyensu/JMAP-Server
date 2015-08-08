var express    = require('express');
var app        = express();
var bodyParser = require('body-parser');
var Promise    = require('bluebird');
var models     = require('./models.js');
var _          = require('lodash');
var utils      = require('./utils');
var config     = require('./config.js');

var methods = {};
_.forEach(models, function (model) {
    _.forEach(model.methods, function (method, methodName) {
        methods[methodName] = method;
    });
});

app.use(bodyParser.json());

app.post('/', function (req, res) {
    var promises = [];

    _.forEach(req.body, function (message) {
        // TODO check req.body and message are valid data
        var method = message[0],
            args = message[1],
            callId = message[2];
        promises.push(utils.executeMethod(methods[method], args, callId));
    });

    Promise.all(promises).then(function (responses) {
        var r = [];
        /** flatten responses if an implicit call was made */
        _.forEach(responses, function (response) {
            if (_.isArray(response[0])) {
                r.push(response[0]);
                r.push(response[1]);
            } else {
                r.push(response);
            }
        });
        res.json(r);
    }).catch(function (err) {
        console.log(err);
    });
});

var program = require('commander');

program
    .version('0.0.1')
    .option('-p, --port [port]', 'Specify the port to use (default to 3000')
    .option('-s, --sync', 'Sync PouchDB to local CouchDB server')
    .parse(process.argv);

if (program.sync) config.sync();
var port = program.port || 3000;

var server = app.listen(port, function () {
    var host = server.address().address;
    var port = server.address().port;

    console.log('Listening at http://%s:%s', host, port);
});

// core.fixtures();

// every request received will be transmit
// to core.js (maybe change the name?)
// like so: return core['getMessages'](args)
// this means that index.js will only received
// request and transmit responses (using express?)
