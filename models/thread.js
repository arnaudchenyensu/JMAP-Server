var _       = require('lodash');
var uuid    = require('node-uuid');
var thread = {};

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
