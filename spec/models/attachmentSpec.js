var models = require('../../models.js');

describe("An attachment object", function() {

    var opts = {};
    var attachment = new models.Attachment(opts);

    it("has the property url", function() {
        expect(attachment.url).toBeDefined();
    });

    it("has the property type", function() {
        expect(attachment.type).toBeDefined();
    });

    it("has the property name", function() {
        expect(attachment.name).toBeDefined();
    });

    it("has the property size", function() {
        expect(attachment.size).toBeDefined();
    });

    it("has the property isInline", function() {
        expect(attachment.isInline).toBeDefined();
    });

    it("has the property width", function() {
        expect(attachment.width).toBeDefined();
    });

    it("has the property height", function() {
        expect(attachment.height).toBeDefined();
    });

});
