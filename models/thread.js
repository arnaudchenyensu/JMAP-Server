var _       = require('lodash');
var uuid    = require('node-uuid');
var utils   = require('../utils.js');
var thread  = {};

// immutables or can only be updated by the server
var immutables = ["id"];

thread.id = function (accountId) {
    var date = (new Date().toJSON()).split('.')[0] + 'Z';
    return accountId + '_thread_' + date + uuid.v1();
};

thread.startkey = function (accountId) {
    return accountId + '_thread_';
};

thread.endkey = function (accountId) {
    return accountId + '_thread_\uffff';
};

thread.properties = {
    id: {
        serverSetOnly: true
    },
    messageIds: {
        types: ["array"],
        defaultValue: []
    }
};

thread.methods = {
    getThreads: {
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
            fetchMessages: {
                types: ["Boolean", "null"],
                defaultValue: false,
                before: function (req, opts, res) {
                    // TODO
                }
            },
            fetchMessagesProperties: {
                types: ["array", "null"],
                defaultValue: null
            }
        },
        response: {
            accountId: {
                types: ["string"],
                after: function (req, response, result) {
                    response.accountId = req.accountId;
                }
            },
            state: {
                types: ["string"],
                defaultValue: "TODOstateOfTheServer"
            },
            list: {
                types: ["array"],
                defaultValue: [],
                after: function (req, response, result) {
                    _.forEach(result.rows, function (row) {
                        response.list.push(row.doc);
                    });
                }
            },
            notFound: {
                types: ["array", "null"],
                defaultValue: null,
                after: function (req, response, result) {
                    response.notFound = _.pluck(_.filter(result.errors, {'error': 'not_found'}), 'key');
                    // Also add the threads already deleted to notFound
                    _.forEach(result.deleted, function (row) {
                        response.notFound.push(row.id);
                    });
                    if (response.notFound.length === 0)
                        response.notFound = null;
                }
            }
        },
        responseName: "threads"
    },
    getThreadUpdate: {
        func: utils.getUpdates,
        request: {

        },
        response: {

        },
        responseName: "threadUpdates"
    }
};
thread.create = function (opts) {
    // TODO sort messageIds
    return {
        messageIds: opts.messageIds || []
    };
};

thread.update = function (thread, updatedProperties) {
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
        // If there are no errors, return the new updated thread
        _.keys(thread).forEach(function (key) {
            if (_.contains(properties, key)) {
                thread[key] = updatedProperties[key];
            }
        });
        return thread;
    }
};

thread.destroy = function (mailboxId) {

};

module.exports = thread;
