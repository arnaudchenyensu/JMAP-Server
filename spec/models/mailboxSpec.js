var models = require('../../models.js');

describe("A mailbox object", function() {

    var opts = {
        id: "",
        parentId: null,
        role: null,
        totalMessages: 0,
        unreadMessages: 0,
        totalThread: "",
        unreadThread: ""
    };
    var mailbox = new models.Mailbox(opts, false);

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

    it("has the property mayReadMessageList default to true", function() {
        expect(mailbox.mayReadMessageList).toBe(true);
    });

    it("has the property mayAddMessages default to true", function() {
        expect(mailbox.mayAddMessages).toBe(true);
    });

    it("has the property mayRemoveMessages default to true", function() {
        expect(mailbox.mayRemoveMessages).toBe(true);
    });

    it("has the property mayCreateChild default to true", function() {
        expect(mailbox.mayCreateChild).toBe(true);
    });

    it("has the property mayRenameMailbox default to true", function() {
        expect(mailbox.mayRenameMailbox).toBe(true);
    });

    it("has the property mayDeleteMailbox default to true", function() {
        expect(mailbox.mayDeleteMailbox).toBe(true);
    });

    it("has the property totalMessages default to 0", function() {
        expect(mailbox.totalMessages).toEqual(0);
    });

    it("has the property unreadMessages default to 0", function() {
        expect(mailbox.unreadMessages).toEqual(0);
    });

    it("has the property totalThreads default to 0", function() {
        expect(mailbox.totalThreads).toEqual(0);
    });

    it("has the property unreadThreads default to 0", function() {
        expect(mailbox.unreadThreads).toEqual(0);
    });

});
