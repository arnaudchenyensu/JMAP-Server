var models = function () {};

models.Account = function (opts) {
    this.name = opts.name || null;
    this.isPrimary = opts.isPrimary || null;
    this.isReadOnly = opts.isReadOnly || null;
    this.hasMail = opts.hasMail || null;
    this.hasContacts = opts.hasContacts || null;
    this.hasCalendars = opts.hasCalendars || null;
    this.capabilities = opts.capabilities || null;
};

models.Mailbox = function (opts) {
    this.name = opts.name || null ;
    this.parentId = opts.parentId || null;
    this.role = opts.role || null;
    this.precedence = opts.precedence || null;
    this.mustBeOnlyMailbox = opts.mustBeOnlyMailbox || null;
    this.mayReadMessageList = opts.mayReadMessageList || null;
    this.mayAddMessages = opts.mayAddMessages || null;
    this.mayRemoveMessages = opts.mayRemoveMessages || null;
    this.mayCreateChild = opts.mayCreateChild || null;
    this.mayRenameMailbox = opts.mayRenameMailbox || null;
    this.mayDeleteMailbox = opts.mayDeleteMailbox || null;
    this.totalMessages = opts.totalMessages || null;
    this.unreadMessages = opts.unreadMessages || null;
    this.totalThreads = opts.totalThreads || null;
    this.unreadThreads = opts.unreadThreads || null;
};

models.Thread = function (opts) {
    this.messageIds = opts.messageIds || [];
};
module.exports = models;
