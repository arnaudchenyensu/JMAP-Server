var models = require('../../models.js');

describe("A thread object", function() {

    var opts = {};
    var thread = models.thread.create(opts);

    it("has the property messageIds", function() {
        expect(thread.messageIds).toBeDefined();
    });

});
