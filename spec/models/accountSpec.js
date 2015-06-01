var models = require('../../models.js');

describe("An account object", function() {

    var opts = {};
    var account = models.account.create(opts);

    it("has the property name", function() {
        expect(account.name).toBeDefined();
    });

    it("has the property isPrimary", function() {
        expect(account.isPrimary).toBeDefined();
    });

    it("has the property isReadOnly", function() {
        expect(account.isReadOnly).toBeDefined();
    });

    it("has the property hasMail", function() {
        expect(account.hasMail).toBeDefined();
    });

    it("has the property hasContacts", function() {
        expect(account.hasContacts).toBeDefined();
    });

    it("has the property hasCalendars", function() {
        expect(account.hasCalendars).toBeDefined();
    });

    it("has the property capabilities", function() {
        expect(account.capabilities).toBeDefined();
    });

});
