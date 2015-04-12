var models = require('../../models.js');

describe("A filterCondition object", function() {

    var opts = {};
    var filterCondition = new models.FilterCondition(opts);

    it("has the property inCalendars", function() {
        expect(filterCondition.inCalendars).toBeDefined();
    });

    it("has the property before", function() {
        expect(filterCondition.before).toBeDefined();
    });

    it("has the property after", function() {
        expect(filterCondition.after).toBeDefined();
    });

    it("has the property text", function() {
        expect(filterCondition.text).toBeDefined();
    });

    it("has the property summary", function() {
        expect(filterCondition.summary).toBeDefined();
    });

    it("has the property description", function() {
        expect(filterCondition.description).toBeDefined();
    });

    it("has the property location", function() {
        expect(filterCondition.location).toBeDefined();
    });

    it("has the property organizer", function() {
        expect(filterCondition.organizer).toBeDefined();
    });

    it("has the property attendee", function() {
        expect(filterCondition.attendee).toBeDefined();
    });

});
