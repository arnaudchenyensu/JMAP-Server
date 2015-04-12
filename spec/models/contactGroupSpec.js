var models = require('../../models.js');

describe("A contact group object", function() {

    var opts = {};
    var contactGroup = new models.ContactGroup(opts);

    it("has the property name", function() {
        expect(contactGroup.name).toBeDefined();
    });

    it("has the property contactIds", function() {
        expect(contactGroup.contactIds).toBeDefined();
    });

});
