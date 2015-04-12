var models = require('../../models.js');

describe("A calendar object", function() {

    var opts = {};
    var calendar = new models.Calendar(opts);

    it("has the property name", function() {
        expect(calendar.name).toBeDefined();
    });

    it("has the property colour", function() {
        expect(calendar.colour).toBeDefined();
    });

    it("has the property isVisible", function() {
        expect(calendar.isVisible).toBeDefined();
    });

});
