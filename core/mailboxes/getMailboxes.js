var utils  = require('../utils.js');

var getMailboxes = function (results, args, callId) {
    var responseName = "mailboxes";
    var response = {};

    response.accountId = args.accountId || 'test@test.com';
    var startkey = response.accountId + '_mailbox_';
    var endkey = response.accountId + '_mailbox_\uffff';

    return utils.get(response, args, startkey, endkey).then(function () {
        results.push([responseName, response, callId]);
    }).catch(function (err) {
        console.log(err);
    });
};

module.exports = getMailboxes;
