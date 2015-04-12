var models = require('../../models.js');

describe("An address object", function() {

    var opts = {};
    var address = new models.Address(opts);

    it("has the property type", function() {
        expect(address.type).toBeDefined();
    });

    it("has the property label", function() {
        expect(address.label).toBeDefined();
    });

    it("has the property street", function() {
        expect(address.street).toBeDefined();
    });

    it("has the property locality", function() {
        expect(address.locality).toBeDefined();
    });

    it("has the property region", function() {
        expect(address.region).toBeDefined();
    });

    it("has the property postcode", function() {
        expect(address.postcode).toBeDefined();
    });

    it("has the property country", function() {
        expect(address.country).toBeDefined();
    });

});
