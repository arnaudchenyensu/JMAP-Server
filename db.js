var PouchDB = require('pouchdb');
var db = new PouchDB('jmap');
var models = require('./models.js');
var uuid = require('node-uuid');
var _ = require('lodash');
var Promise = require('bluebird');
PouchDB.replicate('jmap', 'http://localhost:5984/jmap', {live: true});

var methods = function () {};

// init design views
methods.init = function () {
    db.info().then(function (info) {
      console.log(info);
    });
};

// load some dummy data
methods.fixtures = function () {
    // for (var i = 0; i < 10; i++) {
    //     var name = "Account " + i;
    //     var account = new models.Account({
    //         name: name
    //     });
    //     account._id = name;
    //     db.put(account);
    // }
    db.allDocs({keys: ["Account 1", "Account 2"]}).then(function (el) {
        console.log(el);
    });
};

methods.setMailboxes = function (results, args, callId) {
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
            promises.push(methods.setMailboxes.createMailbox(res, creationId, args.create[creationId]));
        });
    }

    // update Mailboxes
    if (args.update) {
        res.notUpdated = {};
        res.updated = [];
        _.keys(args.update).forEach(function (mailboxId) {
            promises.push(methods.setMailboxes.updateMailbox(res, mailboxId, args.update[mailboxId]));
        });
    }

    return Promise.all(promises).then(function () {
        results.push([responseName, res, callId]);
    });
};

methods.setMailboxes.createMailbox = function (res, creationId, mailbox) {
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

methods.setMailboxes.updateMailbox = function (res, mailboxId, updatedProperties) {
    var setError = {
        type: "invalidProperties",
        description: undefined,
        properties: []
    };

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

module.exports = methods;
