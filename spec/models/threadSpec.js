var models = require('../../models.js');

describe("A thread object", function() {

    var opts = {};
    var thread = new models.Thread(opts);

    it("has the property messageIds", function() {
        expect(thread.messageIds).toBeDefined();
    });

});
