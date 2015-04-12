var models = require('../../models.js');

describe("An alert object", function() {

    var opts = {};
    var alert = new models.Alert(opts);

    it("has the property minutesBefore", function() {
        expect(alert.minutesBefore).toBeDefined();
    });

    it("has the property type", function() {
        expect(alert.type).toBeDefined();
    });

});
