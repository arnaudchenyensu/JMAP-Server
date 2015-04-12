var models = require('../../models.js');

describe("An accountState object", function() {

    var opts = {};
    var accountState = new models.AccountState(opts);

    it("has the property mailboxes", function() {
        expect(accountState.mailboxes).toBeDefined();
    });

    it("has the property threads", function() {
        expect(accountState.threads).toBeDefined();
    });

    it("has the property messages", function() {
        expect(accountState.messages).toBeDefined();
    });

    it("has the property contactGroups", function() {
        expect(accountState.contactGroups).toBeDefined();
    });

    it("has the property contacts", function() {
        expect(accountState.contacts).toBeDefined();
    });

    it("has the property calendars", function() {
        expect(accountState.calendars).toBeDefined();
    });

    it("has the property calendarEvents", function() {
        expect(accountState.calendarEvents).toBeDefined();
    });

});
