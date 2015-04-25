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
    res.accountId = args.accountId;
    res.accountId = "test";

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

    var properties = _.keys(mailbox);

    var mayXXX = [
        'mayReadMessageList', 'mayAddMessages', 'mayRemoveMessages',
        'mayCreateChild', 'mayRenameMailbox', 'mayDeleteMailbox'
    ];

    var otherProperties = [
        'totalMessages', 'unreadMessages', 'totalThreads', 'unreadThreads'
    ];

    var validRoles = [
        'inbox', 'archive', 'drafts', 'outbox', 'sent',
        'trash', 'spam', 'templates'
    ];

    function isRoleValid(role) {
        if (role === null || validRoles.indexOf(role) !== -1 || _.startsWith("x-")) {
            return true;
        }
        return false;
        // TODO No two mailboxes may have the same role
    }

    // Validate each property
    properties.forEach(function (property) {
        if (property === "id" && mailbox[property]) {
            setError.properties.push("id");
        } else if (property === "parentId" && mailbox[property] !== null) {
            // TODO need to check other things, see spec
            setError.properties.push("parentId");
        } else if (property === "role" && (!isRoleValid(mailbox[property]) || mailbox[property] !== null)) {
            setError.properties.push("role");
        } else if (property === "mustBeOnlyMailbox") {
            setError.properties.push("mustBeOnlyMailbox");
        } else if ((mayXXX.indexOf(property) !== -1) && mailbox[property] !== true) {
            setError.properties.push(property);
        } else if ((otherProperties.indexOf(property) !== -1) && mailbox[property] !== 0) {
            setError.properties.push(property);
        }
    });

    if (setError.properties.length !== 0) {
        res.notCreated[creationId] = setError;
        return Promise.resolve(setError);
    } else {
        var newMailbox = new models.Mailbox(mailbox);
        var _id = res.accountId + "_mailbox_" + uuid.v1(),
            mustBeOnlyMailbox = true;
        newMailbox._id = _id;
        newMailbox.mustBeOnlyMailbox = true;
        return db.put(newMailbox)
            .then(function () {
                res.created[creationId] = {
                    id: _id,
                    mustBeOnlyMailbox: mustBeOnlyMailbox
                };
                return newMailbox;
            })
            .catch(function (err) {
                console.log(err);
            });
    }
};
module.exports = methods;
