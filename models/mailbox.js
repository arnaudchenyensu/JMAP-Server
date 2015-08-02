var _       = require('lodash');
var uuid    = require('node-uuid');
var utils   = require('../utils.js');
var mailbox = {};

var validRoles = [
    'inbox', 'archive', 'drafts', 'outbox', 'sent',
    'trash', 'spam', 'templates'
];

function isRoleValid(role) {
    if (role === null || _.contains(validRoles, role) || _.startsWith(role, "x-")) {
        return {error: false};
    }
    return {error: true, description: "Role is not valid."};
    // TODO No two mailboxes may have the same role
}

mailbox.id = function (accountId) {
    return accountId + '_mailbox_' + uuid.v1();
};

mailbox.startkey = function (accountId) {
    return accountId + '_mailbox_';
};

mailbox.endkey = function (accountId) {
    return accountId + '_mailbox_\uffff';
};

var isNull = function (val) {
    if (val === null)
        return {error: false};
    return {error: true, description: "must be null."};
};

// TODO
var noLoop = function (val) {
    return {error: false};
};

// TODO
var validUTF8 = function (val) {
    return {error: false};
};

// TODO
var correctSize = function (val) {
    return {error: false};
};

var goodRange = function (val) {
    if (val >= 0 && val <= 2147483648)
        return {error: false};
    return {error: true, description: "must be between 0 and 2^31."};
};

mailbox.properties = {
    id: { // Maybe remove this property because it's never use in get or set
        serverSetOnly: true
    },
    name: {
        types: ["string", "utf8"],
        defaultValue: null,
        checks: [validUTF8, correctSize] // 1 character min, 256bytes size max
    },
    parentId: {
        types: ["string", "null"],
        defaultValue: null,
        checksWhenCreate: [noLoop],
        checksWhenUpdate: [noLoop] // TODO more checks, see spec
    },
    role: {
        types: ["string", "null"],
        defaultValue: null,
        immutable: true,
        checksWhenCreate: [isNull, isRoleValid]
    },
    precedence: {
        types: ["number"],
        defaultValue: 0,
        checks: [goodRange] // 0 <= precedence <= 2^31
    },
    mustBeOnlyMailbox: {
        types: ["boolean"],
        defaultValue: true,
        serverSetOnly: true
    },
    mayReadMessageList: {
        types: ["boolean"],
        defaultValue: true,
        serverSetOnly: true
    },
    mayAddMessages: {
        types: ["boolean"],
        defaultValue: true,
        serverSetOnly: true
    },
    mayRemoveMessages: {
        types: ["boolean"],
        defaultValue: true,
        serverSetOnly: true
    },
    mayCreateChild: {
        types: ["boolean"],
        defaultValue: true,
        serverSetOnly: true
    },
    mayRenameMailbox: {
        types: ["boolean"],
        defaultValue: true,
        serverSetOnly: true
    },
    mayDeleteMailbox: {
        types: ["boolean"],
        defaultValue: true,
        serverSetOnly: true
    },
    totalMessages: {
        types: ["number"],
        defaultValue: 0,
        serverSetOnly: true
    },
    unreadMessages: {
        types: ["number"],
        defaultValue: 0,
        serverSetOnly: true
    },
    totalThreads: {
        types: ["number"],
        defaultValue: 0,
        serverSetOnly: true
    },
    unreadThreads: {
        types: ["number"],
        defaultValue: 0,
        serverSetOnly: true
    }
};

mailbox.methods = {
    getMailboxes: {
        func: utils.get,
        request: {
            accountId: {
                types: ["string", "null"],
                defaultValue: null,
                before: function (req, opts) {
                    // if req.accountId == null, the primary account is used
                    opts.startkey = req.accountId + '_mailbox_';
                    opts.endkey   = req.accountId + '_mailbox_\uffff';
                }
            },
            ids: {
                types: ["array", "null"],
                defaultValue: null,
                before: function (req, opts) {
                    if (req.ids) {
                        opts.keys = req.ids;
                        delete opts.startkey;
                        delete opts.endkey;
                    }
                }
            },
            properties: {
                types: ["array", "null"],
                defaultValue: null
            }
        },
        response: {
            accountId: {
                types: ["string"],
                defaultValue: "defaultAccountId"
            },
            state: {
                types: ["string"],
                defaultValue: "stateOfTheServer"
            },
            list: {
                types: ["array"],
                defaultValue: [],
                after: function (req, response, result) {
                    if (!response.list)
                        response.list = [];
                    if (req.properties !== null) {
                        req.properties.push('id');
                        _.forEach(result.rows, function (row) {
                            response.list.push(_.pick(row.doc, req.properties));
                        });
                    } else {
                        _.forEach(result.rows, function (row) {
                            response.list.push(row.doc);
                        });
                    }
                }
            },
            notFound: {
                types: ["array"],
                defaultValue: [],
                after: function (req, response, result) {
                    response.notFound = _.pluck(_.filter(result.errors, {'error': 'not_found'}), 'key');
                    // Also add the mailboxes already deleted to notFound
                    _.forEach(result.deleted, function (row) {
                        response.notFound.push(row.id);
                    });
                    if (response.notFound.length === 0)
                        response.notFound = null;
                }
            }
        },
        responseName: "mailboxes"
    },
    getMailboxUpdates: {
        func: utils.getUpdates,
        request: {
            accountId: {
                types: ["string", "null"],
                defaultValue: null,
                before: function (req, opts) {
                    opts.accountId = req.accountId;
                    opts.startkey = mailbox.startkey(req.accountId);
                }
            },
            sinceState: {
                types: ["string"],
                before: function (req, opts) {
                    opts.sinceState = req.sinceState;
                }
            },
            fetchRecordProperties: {
                types: ["array", "null"],
                defaultValue: null,
                before: function (req, opts) {

                }
            },
            fetchRecords: {
                types: ["boolean", "null"],
                defaultValue: null,
                before: function (req, opts, res) {
                    if (req.fetchRecords === true) {
                        var args = {
                            accountId: opts.accountId,
                            properties: opts.fetchRecordProperties
                        };
                        res._implicitCall = utils.executeMethod(mailbox.methods.getMailboxes, args, "_");
                    }
                }
            }
        },
        response: {
            accountId: {
                types: ["string"],
                after: function (req, response, result) {
                    response.accountId = req.accountId;
                }
            },
            oldState: {
                types: ["string"],
                after: function (req, response, result) {
                    response.oldState = req.sinceState;
                }
            },
            newState: {
                types: ["string"],
                after: function (req, response, result) {
                    response.newState = result.last_seq + "";
                }
            },
            changed: {
                types: ["array"],
                after: function (req, response, result) {
                    response.changed = _.pluck(_.filter(result.results, function(change) {
                        return change.deleted === undefined;
                    }), "id");
                }
            },
            removed: {
                types: ["array"],
                after: function (req, response, result) {
                    response.removed = _.pluck(_.filter(result.results, {deleted: true}), "id");
                }
            },
            onlyCountsChanged: {
                types: ["boolean"],
                after: function (req, response, result) {
                    response.onlyCountsChanged = false;
                }
            }
        },
        responseName: "mailboxUpdates"
    },
    setMailboxes: {
        func: utils.set,
        request: {
            accountId: {
                types: ["string", "null"],
                defaultValue: null,
                before: function (req, opts) {
                    opts.accountId = req.accountId;
                    // TODO set default opts.accountId
                }
            },
            ifInState: {
                types: ["string", "null"],
                defaultValue: null
            },
            create: {
                types: ["object", "null"], // createMailbox.json
                defaultValue: null,
                before: function (req, opts) {
                    opts.model = mailbox;
                    opts.create = req.create;
                }
            },
            update: {
                types: ["object", "null"],
                defaultValue: null,
                before: function (req, opts) {
                    opts.update = req.update;
                }
            },
            destroy: {
                types: ["array", "null"],
                defaultValue: null,
                before: function (req, opts) {
                    opts.destroy = req.destroy;
                }
            }
        },
        response: {
            accountId: {
                types: ["string"]
            },
            oldState: {
                types: ["string", "null"],
                defaultValue: "defaultOldStateValue"
            },
            newState: {
                types: ["string"],
                defaultValue: "defaultNewStateValue"
            },
            created: {
                types: ["object"],
                defaultValue: {},
                after: function (req, response, result) {
                    response.created = {};
                    _.forEach(result.created, function (obj, creationId) {
                        response.created[creationId] = _.pick(obj, ['id', 'mustBeOnlyMailbox']);
                    });
                }
            },
            updated: {
                types: ["array"],
                defaultValue: [],
                after: function (req, response, result) {
                    response.updated = result.updated;
                }
            },
            destroyed: {
                types: ["array"],
                defaultValue: [],
                after: function (req, response, result) {
                    response.destroyed = result.destroyed;
                }
            },
            notCreated: {
                types: ["array"],
                defaultValue: [],
                after: function (req, response, result) {
                    response.notCreated = result.notCreated;
                }
            },
            notUpdated: {
                types: ["array"],
                defaultValue: [],
                after: function (req, response, result) {
                    response.notUpdated = result.notUpdated;
                }
            },
            notDestroyed: {
                types: ["array"],
                defaultValue: [],
                after: function (req, response, result) {
                    response.notDestroyed = result.notDestroyed;
                }
            }
        },
        responseName: "mailboxesSet"
    }
};

module.exports = mailbox;
