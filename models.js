var models = {};

models.account = require('./models/account.js');
models.mailbox = require('./models/mailbox.js');
models.thread  = require('./models/thread.js');
models.message = require('./models/message.js');

module.exports = models;
