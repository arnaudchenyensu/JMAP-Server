var models = require('../../models.js');

describe("A filterOperator object", function() {

    var opts = {};
    var filterOperator = new models.FilterOperator(opts);

    it("has the property operator", function() {
        expect(filterOperator.operator).toBeDefined();
    });

    it("has the property conditions", function() {
        expect(filterOperator.conditions).toBeDefined();
    });

});
