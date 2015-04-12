var models = require('../../models.js');

describe("A ContactInformation object", function() {

    var opts = {};
    var contactInformation = new models.ContactInformation(opts);

    it("has the property type", function() {
        expect(contactInformation.type).toBeDefined();
    });

    it("has the property label", function() {
        expect(contactInformation.label).toBeDefined();
    });

    it("has the property value", function() {
        expect(contactInformation.value).toBeDefined();
    });

});
