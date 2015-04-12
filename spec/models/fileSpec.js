var models = require('../../models.js');

describe("A file object", function() {

    var opts = {};
    var file = new models.File(opts);

    it("has the property url", function() {
        expect(file.url).toBeDefined();
    });

    it("has the property type", function() {
        expect(file.type).toBeDefined();
    });

    it("has the property name", function() {
        expect(file.name).toBeDefined();
    });

    it("has the property size", function() {
        expect(file.size).toBeDefined();
    });

});
