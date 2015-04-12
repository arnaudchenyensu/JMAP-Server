var models = require('../../models.js');

describe("A participant object", function() {

    var opts = {};
    var participant = new models.Participant(opts);

    it("has the property name", function() {
        expect(participant.name).toBeDefined();
    });

    it("has the property email", function() {
        expect(participant.email).toBeDefined();
    });

    it("has the property isYou", function() {
        expect(participant.isYou).toBeDefined();
    });

    it("has the property rsvp", function() {
        expect(participant.rsvp).toBeDefined();
    });

});
