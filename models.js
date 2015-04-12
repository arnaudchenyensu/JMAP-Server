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

models.Message = function (opts) {
    this.threadId = opts.threadId || null;
    this.mailboxIds = opts.mailboxIds || [];
    this.inReplyToMessageId = opts.inReplyToMessageId || null;
    this.isUnread = opts.isUnread || null;
    this.isFlagged = opts.isFlagged || null;
    this.isAnswered = opts.isAnswered || null;
    this.isDraft = opts.isDraft || null;
    this.hasAttachment = opts.hasAttachment || null;
    this.rawUrl = opts.rawUrl || null;
    this.headers = opts.headers || [];
    this.from = opts.from || null;
    this.to = opts.to || [];
    this.cc = opts.cc || [];
    this.bcc = opts.bcc || [];
    this.replyTo = opts.replyTo || null;
    this.subject = opts.subject || null;
    this.date = opts.date || null;
    this.size = opts.size || null;
    this.preview = opts.preview || null;
    this.textBody = opts.textBody || null;
    this.htmlBody = opts.htmlBody || null;
    this.attachments = opts.attachments || [];
    this.attachedMessages = opts.attachedMessages || [];
};

models.Emailer = function (opts) {
    this.name = opts.name || null;
    this.email = opts.email || null;
};

models.Attachment = function (opts) {
    this.url = opts.url || null;
    this.type = opts.type || null;
    this.name = opts.name || null;
    this.size = opts.size || null;
    this.isInline = opts.isInline || null;
    this.width = opts.width || null;
    this.height = opts.height || null;
};

models.SearchSnippet = function (opts) {
    this.messageId = opts.messageId || null;
    this.subject = opts.subject || null;
    this.preview = opts.preview || null;
};

models.ContactGroup = function (opts) {
    this.name = opts.name || null;
    this.contactIds = opts.contactIds || [];
};

models.Contact = function (opts) {
    this.isFlagged = opts.isFlagged || null;
    this.avatar = opts.avatar || null;
    this.prefix = opts.prefix || "";
    this.firstName = opts.firstName || "";
    this.lastName = opts.lastName || "";
    this.suffix = opts.suffix || "";
    this.nickname = opts.nickname || "";
    this.birthday = opts.birthday || "0000-00-00";
    this.anniversary = opts.anniversary || "0000-00-00";
    this.company = opts.company || "";
    this.department = opts.department || "";
    this.jobTitle = opts.jobTitle || "";
    this.emails = opts.emails || [];
    this.defaultEmailIndex = opts.defaultEmailIndex || null;
    this.phones = opts.phones || [];
    this.online = opts.online || [];
    this.addresses = opts.addresses || [];
    this.notes = opts.notes || "";
};

models.ContactInformation = function (opts) {
    this.type = opts.type || null;
    this.label = opts.label || null;
    this.value = opts.value || null;
};

module.exports = models;
