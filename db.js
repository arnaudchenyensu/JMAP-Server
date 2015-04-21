// args
// accountId: String (optional)
// ifInState: String (optional)
// create: String[Mailbox] (optional)
// update: String[Mailbox] (optional)
// destroy: String[]
methods.setMailboxes = function (args) {
    var res = {};

    // defaults to primary account, how we do that???
    // maybe check tokens, cookies...?
    res.accountId = args.accountId;

    if (args.ifInState) {
        // check state
    }

    // create Mailboxes
    if (args.create) {
        res.notCreated = {};
        res.created = {};
        _.keys(args.create).forEach(function (key) {
            methods.setMailboxes.createMailbox(res, key, args.create[key]);
        });
    }

    return res;
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

    var validRole = [
        'inbox', 'archive', 'drafts', 'outbox', 'sent',
        'trash', 'spam', 'templates'
    ];

    function isRoleValid(role) {
        if (role === null || validRole.indexOf(role) !== -1 || _.startsWith("x-")) {
            return true;
        }
        return false;
        // TODO No two mailboxes may have the same role
    }

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
    } else {
        // create mailbox db.put(...)
        var _id = res.accountId + "_mailbox_" + uuid.v1(),
            mustBeOnlyMailbox = true;
        res.created[creationId] = {
            id: _id,
            mustBeOnlyMailbox: mustBeOnlyMailbox
        };
    }
};
