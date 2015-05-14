var models = require('../../models.js');
var utils  = require('../utils.js');

var setMailboxes = function (results, args, callId) {
    var responseName = "mailboxesSet";
    var response = {};
    var promises = [];

    // TODO defaults to primary account, how we do that???
    // maybe check tokens, cookies...?
    response.accountId = args.accountId || "test@test.com";

    return utils.set(response, args, models.mailbox).then(function () {
        results.push([responseName, response, callId]);
    }).catch(function (err) {
        console.log(err);
    });
};

var updateMailbox = function (res, mailboxId, updatedProperties) {

};

var destroyMailbox = function (res, mailboxId) {
    // TODO
};

module.exports = setMailboxes;
