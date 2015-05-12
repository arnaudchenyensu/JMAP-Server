var config = require('../../../config.js');
var db     = config.db;
var core   = require('../../../core.js');
var _      = require('lodash');
var Promise = require('bluebird');

var utils = {};

var callId = "#1";
var args = {
    accountId: "test@test.com",
    ifInState: "",
    create: {},
    update: {},
    destroy: []
};

var validCreateObject = {
    id: "",
    parentId: null,
    role: null,
    totalMessages: 0,
    unreadMessages: 0,
    totalThread: "",
    unreadThread: ""
};

// List of ids created, use for cleanup
var created = [];

utils.createMailboxes = function (number) {
    var res = [];
    for (var i = 0; i < number; i++) {
        args.create[i] = validCreateObject;
    }
    return core.setMailboxes(res, args, callId).then(function () {
        var ids = [];
        _.keys(res[0][1].created).forEach(function (key) {
            var id = res[0][1].created[key].id;
            ids.push(id);
            created.push(id);
        });
        return ids;
    });
};

utils.cleanup = function () {
    var promises = [];
    created.forEach(function (id) {
        promises.push(db.get(id).then(function (doc) {
            return db.remove(doc);
        }));
    });
    return Promise.all(promises);
};

module.exports = utils;
