var models = require('../../models.js');

describe("A calendarEvent object", function() {

    var opts = {};
    var calendarEvent = new models.CalendarEvent(opts);

    it("has the property calendarId", function() {
        expect(calendarEvent.calendarId).toBeDefined();
    });

    it("has the property summary", function() {
        expect(calendarEvent.summary).toBeDefined();
    });

    it("has the property description", function() {
        expect(calendarEvent.description).toBeDefined();
    });

    it("has the property location", function() {
        expect(calendarEvent.location).toBeDefined();
    });

    it("has the property showAsFree", function() {
        expect(calendarEvent.showAsFree).toBeDefined();
    });

    it("has the property isAllDay", function() {
        expect(calendarEvent.isAllDay).toBeDefined();
    });

    it("has the property utcStart", function() {
        expect(calendarEvent.utcStart).toBeDefined();
    });

    it("has the property utcEnd", function() {
        expect(calendarEvent.utcEnd).toBeDefined();
    });

    it("has the property startTimeZone", function() {
        expect(calendarEvent.startTimeZone).toBeDefined();
    });

    it("has the property endTimeZone", function() {
        expect(calendarEvent.endTimeZone).toBeDefined();
    });

    it("has the property recurrence", function() {
        expect(calendarEvent.recurrence).toBeDefined();
    });

    it("has the property inclusions", function() {
        expect(calendarEvent.inclusions).toBeDefined();
    });

    it("has the property exceptions", function() {
        expect(calendarEvent.exceptions).toBeDefined();
    });

    it("has the property alerts", function() {
        expect(calendarEvent.alerts).toBeDefined();
    });

    it("has the property organizer", function() {
        expect(calendarEvent.organizer).toBeDefined();
    });

    it("has the property attendees", function() {
        expect(calendarEvent.attendees).toBeDefined();
    });

    it("has the property attachments", function() {
        expect(calendarEvent.attachments).toBeDefined();
    });

});
