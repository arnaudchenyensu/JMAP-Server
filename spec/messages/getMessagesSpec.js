var config     = require('../../config.js');
var db         = config.db;
var core       = require('../../utils.js');
var _          = require('lodash');
var Promise    = require('bluebird');
var getMessages = require('../../models/message.js').methods.getMessages;

describe("getMessages method", function () {

    var ids = ["test_message_1", "test_message_2"];
    var callId = "#1";
    var args = {
        accountId: "test@test.com",
        ids: ["test_message_1", "test_message_2"]
    };

    beforeAll(function (done) {
        /** Create two messages in DB for testing purpose */
        db.put({
            _id: ids[0]
        }).then(function () {
            return db.put({
                _id: ids[1]
            });
        }).then(function () {
            done();
        });
    });

    afterAll(function (done) {
        /** Cleanup */
        Promise.all(_.map(ids, function (id) {
            return db.get(id).then(function (doc) {
                return db.remove(doc);
            });
        })).then(function () {
            done();
        });
    });

    it("should return a correct response", function (done) {
        core.executeMethod(getMessages, args, callId).then(function (res) {
            expect(res[0]).toEqual("messages");
            var messages = res[1].list;
            expect(messages[0].id).toEqual(ids[0]);
            expect(messages[1].id).toEqual(ids[1]);
            expect(res[1].notFound).toBeNull();
            done();
        });
    });
});
