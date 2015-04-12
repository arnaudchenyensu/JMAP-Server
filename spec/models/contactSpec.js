var models = require('../../models.js');

describe("A contact object", function() {

    var opts = {};
    var contact = new models.Contact(opts);

    it("has the property isFlagged", function() {
        expect(contact.isFlagged).toBeDefined();
    });

    it("has the property avatar", function() {
        expect(contact.avatar).toBeDefined();
    });

    it("has the property prefix", function() {
        expect(contact.prefix).toBeDefined();
    });

    it("has the property firstName", function() {
        expect(contact.firstName).toBeDefined();
    });

    it("has the property lastName", function() {
        expect(contact.lastName).toBeDefined();
    });

    it("has the property suffix", function() {
        expect(contact.suffix).toBeDefined();
    });

    it("has the property nickname", function() {
        expect(contact.nickname).toBeDefined();
    });

    it("has the property birthday", function() {
        expect(contact.birthday).toBeDefined();
    });

    it("has the property anniversary", function() {
        expect(contact.anniversary).toBeDefined();
    });

    it("has the property company", function() {
        expect(contact.company).toBeDefined();
    });

    it("has the property department", function() {
        expect(contact.department).toBeDefined();
    });

    it("has the property jobTitle", function() {
        expect(contact.jobTitle).toBeDefined();
    });

    it("has the property emails", function() {
        expect(contact.emails).toBeDefined();
    });

    it("has the property defaultEmailIndex", function() {
        expect(contact.defaultEmailIndex).toBeDefined();
    });

    it("has the property phones", function() {
        expect(contact.phones).toBeDefined();
    });

    it("has the property online", function() {
        expect(contact.online).toBeDefined();
    });

    it("has the property addresses", function() {
        expect(contact.addresses).toBeDefined();
    });

    it("has the property notes", function() {
        expect(contact.notes).toBeDefined();
    });

});
