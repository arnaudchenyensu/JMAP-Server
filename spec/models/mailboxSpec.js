var models = require('../../models.js');

describe("A mailbox object", function() {

    var opts = {};
    var mailbox = new models.Mailbox(opts);

    it("has the property name", function() {
        expect(mailbox.name).toBeDefined();
    });

    it("has the property parentId", function() {
        expect(mailbox.parentId).toBeDefined();
    });

    it("has the property role", function() {
        expect(mailbox.role).toBeDefined();
    });

    it("has the property precedence", function() {
        expect(mailbox.precedence).toBeDefined();
    });

    it("has the property mustBeOnlyMailbox", function() {
        expect(mailbox.mustBeOnlyMailbox).toBeDefined();
    });

    it("has the property mayReadMessageList", function() {
        expect(mailbox.mayReadMessageList).toBeDefined();
    });

    it("has the property mayAddMessages", function() {
        expect(mailbox.mayAddMessages).toBeDefined();
    });

    it("has the property mayRemoveMessages", function() {
        expect(mailbox.mayRemoveMessages).toBeDefined();
    });

    it("has the property mayCreateChild", function() {
        expect(mailbox.mayCreateChild).toBeDefined();
    });

    it("has the property mayRenameMailbox", function() {
        expect(mailbox.mayRenameMailbox).toBeDefined();
    });

    it("has the property mayDeleteMailbox", function() {
        expect(mailbox.mayDeleteMailbox).toBeDefined();
    });

    it("has the property totalMessages", function() {
        expect(mailbox.totalMessages).toBeDefined();
    });

    it("has the property unreadMessages", function() {
        expect(mailbox.unreadMessages).toBeDefined();
    });

    it("has the property totalThreads", function() {
        expect(mailbox.totalThreads).toBeDefined();
    });

    it("has the property unreadThreads", function() {
        expect(mailbox.unreadThreads).toBeDefined();
    });

});
