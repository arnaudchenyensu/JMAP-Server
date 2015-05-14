var config  = require('./config.js');
var db      = config.db;
var models  = require('./models.js');

var core = function () {};

// Mailboxes
core.getMailboxes      = require('./core/mailboxes/getMailboxes');
core.getMailboxUpdates = require('./core/mailboxes/getMailboxUpdates');
core.setMailboxes      = require('./core/mailboxes/setMailboxes.js');

module.exports = core;
