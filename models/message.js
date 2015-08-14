var _       = require('lodash');
var uuid    = require('node-uuid');
var utils   = require('../utils.js');
var message = {};

// TODO threadId
message.id = function (accountId, threadId) {
    var date = utils.date();
    return accountId + '_message_' + threadId + '_' + date + '_' + uuid.v1();
};

message.startkey = function (accountId) {
    return accountId + '_message_';
};

message.endkey = function (accountId) {
    return accountId + '_message_\uffff';
};

// TODO check Emailer object for properties from, to, ...
message.properties = {
    id: {
        serverSetOnly: true
    },
    blobId: {
        types: ["string"],
        defaultValue: "defautBlobId",
        serverSetOnly: true
    },
    threadId: {
        types: ["string"],
        defaultValue: "defaultThreadId",
        serverSetOnly: true
    },
    mailboxIds: {
        types: ["array"],
        defaultValue: []
    },
    inReplyToMessageId: {
        types: ["string", "null"],
        immutable: true
    },
    isUnread: {
        types: ["boolean"],
        defaultValue: true
    },
    isFlagged: {
        types: ["boolean"],
        defaultValue: false
    },
    isAnswered: {
        types: ["boolean"],
        defaultValue: false
    },
    isDraft: {
        types: ["boolean"],
        defaultValue: true
    },
    hasAttachment: {
        types: ["boolean"],
        defaultValue: false
    },
    headers: {
        types: ["array"],
        immutable: true
    },
    from: {
        types: ["object", "null"],
        defaultValue: null,
        immutable: true
    },
    to: {
        types: ["array", "null"],
        defaultValue: null,
        immutable: true
    },
    cc: {
        types: ["array", "null"],
        defaultValue: null,
        immutable: true
    },
    bcc: {
        types: ["array", "null"],
        defaultValue: null,
        immutable: true
    },
    replyTo: {
        types: ["object", "null"],
        defaultValue: null,
        immutable: true
    },
    subject: {
        types: ["string"],
        defaultValue: "",
        immutable: true
    },
    date: {
        types: ["date"],
        immutable: true
    },
    size: {
        types: ["number"],
        defaultValue: "defaultSize",
        immutable: true
    },
    preview: {
        types: ["string"],
        immutable: true
    },
    textBody: {
        types: ["string", "null"],
        defaultValue: null,
        immutable: true
    },
    htmlBody: {
        types: ["string", "null"],
        defaultValue: null,
        immutable: true
    },
    attachments: {
        types: ["array", "null"],
        defaultValue: null,
        immutable: true
    },
    attachedMessages: {
        types: ["object", "null"],
        defaultValue: null,
        immutable: true
    }
};

message.methods = {
    getMessages: {
        func: utils.get,
        request: {
            accountId: {
                types: ["string", "null"]
            },
            ids: {
                types: ["array"],
                defaultValue: [],
                before: function (req, opts) {
                    opts.keys = req.ids;
                }
            },
            properties: {
                types: ["array", "null"],
                defaultValue: null
            }
        },
        response: {
            accountId: {
                types: ["string"]
            },
            state: {
                types: ["string"],
                defaultValue: "TODOstateOfTheServer"
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
                types: ["array", "null"],
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
        responseName: "messages"
    },
    setMessages: {
        func: utils.set,
        request: {
            accountId: {
                types: ["string", "null"],
                before: function (req, opts) {
                    opts.accountId = req.accountId;
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
                    opts.model = message;
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
                        var param = ['id', 'blobId', 'threadId', 'size'];
                        response.created[creationId] = _.pick(obj, param);
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
        responseName: "messagesSet"
    }
};

module.exports = message;






