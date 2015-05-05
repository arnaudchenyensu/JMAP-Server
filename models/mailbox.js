var _ = require('lodash');
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
