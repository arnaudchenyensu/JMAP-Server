var models = require('../../models.js');

describe("An emailer", function() {

    var opts = {};
    var emailer = new models.Emailer(opts);

    it("has the property name", function() {
        expect(emailer.name).toBeDefined();
    });

    it("has the property email", function() {
        expect(emailer.email).toBeDefined();
    });

});
