var core         = require('../../utils.js');
var _            = require('lodash');
var setMessages = require('../../models/message.js').methods.setMessages;

describe("setMessages method", function () {

    var callId = "#1";
    var args = {
        accountId: "test@test.com",
        ifInState: "",
        create: {},
        update: {},
        destroy: []
    };

    var validCreateObject = {
        mailboxIds: ["fakeId"],
        textBody: "dummy text body."
    };

    describe("createMessage method", function () {

        beforeEach(function () {
            args.create.message = _.clone(validCreateObject);
        });

        it("should create a message", function (done) {
            core.executeMethod(setMessages, args, callId).then(function (res) {
                var message = res[1].created.message;
                expect(message).toBeDefined();
                expect(message.id).toBeDefined();
                expect(message.blobId).toBeDefined();
                expect(message.threadId).toBeDefined();
                expect(message.size).toBeDefined();
                done();
            });
        });
    });
});
