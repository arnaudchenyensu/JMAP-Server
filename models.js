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

module.exports = models;
