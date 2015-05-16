var account = {};

// TODO
// id, startkey, endkey
// account@example.com and shared.account@example.com are the same account

account.create = function (opts) {
    return {
        name: opts.name || null,
        isPrimary: opts.isPrimary || null,
        isReadOnly: opts.isReadOnly || null,
        hasMail: opts.hasMail || null,
        hasContacts: opts.hasContacts || null,
        hasCalendars: opts.hasCalendars || null,
        capabilities: opts.capabilities || null
    };
};

account.update = function (account, updatedProperties) {

};

account.destroy = function (accountId) {

};

module.exports = account;
