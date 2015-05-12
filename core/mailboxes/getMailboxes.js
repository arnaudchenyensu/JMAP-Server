var config = require('../../config.js');
var db     = config.db;
var _      = require('lodash');

var getMailboxes = function (results, args, callId) {
    var responseName = "mailboxes";
    var res = {};
    var promises = [];
    var opts = {};

    res.accountId = args.accountId || 'test@test.com';
    // TODO manage state of the server
    res.state = "stateOfTheServer";
    res.list = [];
    res.notFound = [];

    opts.include_docs = true;
    if (args !== null && args.ids) {
        opts.keys = args.ids;
    } else {
        opts.startkey = res.accountId + '_mailbox_';
        opts.endkey = res.accountId + '_mailbox_\uffff';
    }

    return db.allDocs(opts).then(function (r) {
        r.rows.forEach(function (row) {
            if (row.error === "not_found") {
                res.notFound.push(row.key);
            } else if (!row.value.deleted) {
                if (args.properties && args.properties.length !== 0) {
                    res.list.push(_.pick(row.doc, args.properties));
                } else {
                    res.list.push(row.doc);
                }
                var i = res.list.length - 1;
                res.list[i].id = row.id;
                delete res.list[i]._id;
                delete res.list[i]._rev;
            }
        });
        if (res.notFound.length === 0)
            res.notFound = null;
        results.push([responseName, res, callId]);
    }).catch(function (err) {
        console.log(err);
    });
};

module.exports = getMailboxes;
