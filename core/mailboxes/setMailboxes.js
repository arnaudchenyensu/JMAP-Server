var config  = require('../../config.js');
var db      = config.db;
var models  = require('../../models.js');
var Promise = require('bluebird');
var _       = require('lodash');
var uuid    = require('node-uuid');

var setMailboxes = function (results, args, callId) {
    var responseName = "mailboxesSet";
    var res = {};
    var promises = [];

    // TODO defaults to primary account, how we do that???
    // maybe check tokens, cookies...?
    res.accountId = args.accountId || "test";

    if (args.ifInState) {
        // TODO check state
    }

    // create Mailboxes
    if (args.create) {
        res.notCreated = {};
        res.created = {};
        _.keys(args.create).forEach(function (creationId) {
            promises.push(createMailbox(res, creationId, args.create[creationId]));
        });
    }

    // update Mailboxes
    if (args.update) {
        res.notUpdated = {};
        res.updated = [];
        _.keys(args.update).forEach(function (mailboxId) {
            promises.push(updateMailbox(res, mailboxId, args.update[mailboxId]));
        });
    }

    // destroy Mailboxes
    if (args.destroy) {
        res.notDestroyed = {};
        res.destroyed = {};
        args.destroy.forEach(function (mailboxId) {
            promises.push(destroyMailbox(res, mailboxId));
        });
    }

    return Promise.all(promises).then(function () {
        results.push([responseName, res, callId]);
    });
};

var createMailbox = function (res, creationId, mailbox) {
    var setError = {
        type: "invalidProperties",
        description: undefined,
        properties: []
    };

    var newMailbox = models.mailbox.create(mailbox);

    if (newMailbox.__invalidProperties) {
        setError.properties = newMailbox.__invalidProperties;
        res.notCreated[creationId] = setError;
        return Promise.resolve(setError);
    } else {
        var _id = res.accountId + "_mailbox_" + uuid.v1(),
            mustBeOnlyMailbox = true;
        newMailbox._id = _id;
        newMailbox.mustBeOnlyMailbox = true;
        return db.put(newMailbox).then(function () {
            res.created[creationId] = {
                id: _id,
                mustBeOnlyMailbox: mustBeOnlyMailbox
            };
            return newMailbox;
        }).catch(function (err) {
            console.log(err);
        });
    }
};

var updateMailbox = function (res, mailboxId, updatedProperties) {
    var setError = {
        type: "invalidProperties",
        description: undefined,
        properties: []
    };

    // TODO notFound error for the id
    return db.get(mailboxId).then(function (mailbox) {
        var updatedMailbox = models.mailbox.update(mailbox, updatedProperties);
        if (updatedMailbox.__invalidProperties) {
            setError.properties = updatedMailbox.__invalidProperties;
            res.notUpdated[mailboxId] = setError;
            return Promise.resolve(setError);
        } else {
            return db.put(mailbox).then(function () {
                res.updated.push(mailboxId);
            }).catch(function (err) {
                console.log(err);
            });
        }
    });
};

var destroyMailbox = function (res, mailboxId) {
    // TODO
};

module.exports = setMailboxes;
