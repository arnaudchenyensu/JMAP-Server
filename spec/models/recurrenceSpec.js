var models = require('../../models.js');

describe("A recurrence object", function() {

    var opts = {};
    var recurrence = new models.Recurrence(opts);

    it("has the property frequency", function() {
        expect(recurrence.frequency).toBeDefined();
    });

    it("has the property interval", function() {
        expect(recurrence.interval).toBeDefined();
    });

    it("has the property firstDayOfWeek", function() {
        expect(recurrence.firstDayOfWeek).toBeDefined();
    });

    it("has the property byDay", function() {
        expect(recurrence.byDay).toBeDefined();
    });

    it("has the property byDate", function() {
        expect(recurrence.byDate).toBeDefined();
    });

    it("has the property byMonth", function() {
        expect(recurrence.byMonth).toBeDefined();
    });

    it("has the property byYearDay", function() {
        expect(recurrence.byYearDay).toBeDefined();
    });

    it("has the property byWeekNo", function() {
        expect(recurrence.byWeekNo).toBeDefined();
    });

    it("has the property byHour", function() {
        expect(recurrence.byHour).toBeDefined();
    });

    it("has the property byMinute", function() {
        expect(recurrence.byMinute).toBeDefined();
    });

    it("has the property bySecond", function() {
        expect(recurrence.bySecond).toBeDefined();
    });

    it("has the property bySetPosition", function() {
        expect(recurrence.bySetPosition).toBeDefined();
    });

    it("has the property count", function() {
        expect(recurrence.count).toBeDefined();
    });

    it("has the property until", function() {
        expect(recurrence.until).toBeDefined();
    });

});
