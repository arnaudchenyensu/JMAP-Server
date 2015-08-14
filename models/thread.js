var _       = require('lodash');
var uuid    = require('node-uuid');
var utils   = require('../utils.js');
var thread  = {};

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
    }
};

module.exports = thread;
