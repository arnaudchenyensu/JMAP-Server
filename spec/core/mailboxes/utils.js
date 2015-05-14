var config  = require('../../../config.js');
var db      = config.db;
var core    = require('../../../core.js');
var models  = require('../../../models.js');
var _       = require('lodash');
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
        });
        return ids;
    });
};

utils.cleanup = function (accountId) {
    var promises = [];
    var opts = {
        startkey: models.mailbox.startkey(accountId),
        endkey: models.mailbox.endkey(accountId)
    };

    return db.allDocs(opts).then(function (mailboxes) {
        mailboxes.rows.forEach(function (mailbox) {
            promises.push(db.remove({'_id': mailbox.id, '_rev': mailbox.value.rev}));
        });
        return Promise.all(promises);
    }).catch(function (err) {
        console.log(err);
    });
};

module.exports = utils;
