var PouchDB = require('pouchdb');
var db = new PouchDB('jmap');
var models = require('./models.js');
var uuid = require('node-uuid');
var _ = require('lodash');
var Promise = require('bluebird');
PouchDB.replicate('jmap', 'http://localhost:5984/jmap', {live: true});

var methods = function () {};
// args
// accountId: String (optional)
// ifInState: String (optional)
// create: String[Mailbox] (optional)
// update: String[Mailbox] (optional)
// destroy: String[]
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

    var newMailbox = new models.Mailbox(mailbox, false);

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
module.exports = methods;
