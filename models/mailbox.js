var _       = require('lodash');
var uuid    = require('node-uuid');
var utils   = require('../utils.js');
var mailbox = {};

// immutables or can only be updated by the server
var immutables = [
    "id", "role", "mustBeOnlyMailbox",
    "mayReadMessageList", "mayAddMessages",
    "mayRemoveMessages", "mayCreateChild",
    "mayRenameMailbox", "mayDeleteMailbox",
    "totalMessages", "unreadMessages",
    "totalThreads", "unreadThreads"
];

var mayXXX = [
    'mayReadMessageList', 'mayAddMessages', 'mayRemoveMessages',
    'mayCreateChild', 'mayRenameMailbox', 'mayDeleteMailbox'
];

var validRoles = [
    'inbox', 'archive', 'drafts', 'outbox', 'sent',
    'trash', 'spam', 'templates'
];

function isRoleValid(role) {
    if (role === null || _.contains(validRoles, role) || _.startsWith(role, "x-")) {
        return true;
    }
    return false;
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

mailbox.properties = {
    id: {
        types: ["string"],
        defaultValue: null
    },
    name: {
        types: ["string"],
        defaultValue: null
    },
    parentId: {
        types: ["string", "null"],
        defaultValue: null
    },
    role: {
        types: ["string", "null"],
        defaultValue: null
    },
    precedence: {
        types: ["number"],
        defaultValue: null
    },
    mustBeOnlyMailbox: {
        types: ["boolean"],
        defaultValue: true
    },
    mayReadMessageList: {
        types: ["boolean"],
        defaultValue: true,
    },
    mayAddMessages: {
        types: ["boolean"],
        defaultValue: true,
    },
    mayRemoveMessages: {
        types: ["boolean"],
        defaultValue: true,
    },
    mayCreateChild: {
        types: ["boolean"],
        defaultValue: true,
    },
    mayRenameMailbox: {
        types: ["boolean"],
        defaultValue: true,
    },
    mayDeleteMailbox: {
        types: ["boolean"],
        defaultValue: true,
    },
    totalMessages: {
        types: ["number"],
        defaultValue: 0
    },
    unreadMessages: {
        types: ["number"],
        defaultValue: 0
    },
    totalThreads: {
        types: ["number"],
        defaultValue: 0
    },
    unreadThreads: {
        types: ["number"],
        defaultValue: 0
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
                defaultValue: null,
                after: function (req, response, result) {
                    response.notFound = _.pluck(_.filter(result.errors, {'error': 'not_found'}), 'key');
                    if (response.notFound.length === 0)
                        response.notFound = null;
                }
            }
        },
        responseName: "mailboxes"
    },
    getMailboxUpdates: {
        method: "getFooUpdates",
        responseName: "mailboxUpdates"
    },
    setMailboxes: {
        method: "setFoos",
        responseName: "mailboxesSet"
    }
};
mailbox.create = function (opts) {
    var invalidProperties = [];
    var properties = _.keys(opts);

    var otherProperties = [
        'totalMessages', 'unreadMessages', 'totalThreads', 'unreadThreads'
    ];

    if (opts.id) {
        invalidProperties.push("id");
    }

    if (opts.parentId !== null) {
        // TODO need to check other things, see spec
        invalidProperties.push("parentId");
    }

    if (opts.role) {
        // TODO No two mailboxes may have the same role
        if (!isRoleValid(opts.role)) {
            invalidProperties.push("role");
        }
    }

    if (opts.mustBeOnlyMailbox) {
        invalidProperties.push("mustBeOnlyMailbox");
    }

    properties.forEach(function (property) {
        if (_.contains(mayXXX, property) && opts[property] !== true) {
            invalidProperties.push(property);
        } else if (_.contains(otherProperties, property) && opts[property] !== 0) {
            invalidProperties.push(property);
        }
    });

    if (invalidProperties.length !== 0) {
        // do not create the object
        return {__invalidProperties: invalidProperties};
    } else {
        // If there are no errors, create a mailbox object
        // with defaults values
        return {
            name: opts.name || null,
            parentId: opts.parentId || null,
            role: opts.role || null,
            precedence: opts.precedence || null,
            mustBeOnlyMailbox: opts.mustBeOnlyMailbox || true,
            mayReadMessageList: opts.mayReadMessageList || true,
            mayAddMessages: opts.mayAddMessages || true,
            mayRemoveMessages: opts.mayRemoveMessages || true,
            mayCreateChild: opts.mayCreateChild || true,
            mayRenameMailbox: opts.mayRenameMailbox || true,
            mayDeleteMailbox: opts.mayDeleteMailbox || true,
            totalMessages: opts.totalMessages || 0,
            unreadMessages: opts.unreadMessages || 0,
            totalThreads: opts.totalThreads || 0,
            unreadThreads: opts.unreadThreads || 0
        };
    }
};

mailbox.update = function (mailbox, updatedProperties) {
    var properties = _.keys(updatedProperties);
    var invalidProperties = [];

    if (updatedProperties.name) {
        // TODO valid UTF-8
    }

    if (updatedProperties.hasOwnProperty("parentId") && updatedProperties.parentId !== null) {
        // TODO need to check something else
        invalidProperties.push("parentId");
    }

    properties.forEach(function (property) {
        if (_.contains(immutables, property)) {
            invalidProperties.push(property);
        }
    });

    if (invalidProperties.length !== 0) {
        // do not create the object
        return {__invalidProperties: invalidProperties};
    } else {
        // If there are no errors, return the new updated mailbox
        _.keys(mailbox).forEach(function (key) {
            if (_.contains(properties, key)) {
                mailbox[key] = updatedProperties[key];
            }
        });
        return mailbox;
    }
};

mailbox.destroy = function (mailboxId) {

};

module.exports = mailbox;
