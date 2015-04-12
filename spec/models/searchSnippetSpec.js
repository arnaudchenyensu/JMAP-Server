var models = require('../../models.js');

describe("A searchSnippet object", function() {

    var opts = {};
    var searchSnippet = new models.SearchSnippet(opts);

    it("has the property messageId", function() {
        expect(searchSnippet.messageId).toBeDefined();
    });

    it("has the property subject", function() {
        expect(searchSnippet.subject).toBeDefined();
    });

    it("has the property preview", function() {
        expect(searchSnippet.preview).toBeDefined();
    });

});
