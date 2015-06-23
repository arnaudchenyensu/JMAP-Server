var config  = require('../../config.js');
var db      = config.db;
var core    = require('../../utils.js');
var models  = require('../../models.js');
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
    parentId: null,
    role: null
};

utils.createMailboxes = function (number) {
    var opts = {
        accountId: "test@test.com",
        create: [],
        model: models.mailbox
    };
    for (var i = 0; i < number; i++) {
        opts.create[i] = validCreateObject;
    }
    return core.set(opts).then(function (res) {
        var ids = [];
        _.keys(res.created).forEach(function (key) {
            var id = res.created[key].id;
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
