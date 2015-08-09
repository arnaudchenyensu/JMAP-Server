var config     = require('../../config.js');
var db         = config.db;
var core       = require('../../utils.js');
var _          = require('lodash');
var Promise    = require('bluebird');
var getThreads = require('../../models/thread.js').methods.getThreads;

describe("getThreads method", function () {

    var ids = ["test_thread_1", "test_thread_2"];
    var callId = "#1";
    var args = {
        accountId: "examples@examples.com",
        ids: ["test_thread_1", "test_thread_2"],
        fetchMessages: false,
        fetchMessageProperties: null
    };

    beforeAll(function (done) {
        /** Create two threads in DB for testing purpose */
        db.put({
            _id: ids[0],
            messageIds: ["test"]
        }).then(function () {
            return db.put({
                _id: ids[1],
                messageIds: ["test"]
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
        core.executeMethod(getThreads, args, callId).then(function (res) {
            expect(res[0]).toEqual("threads");
            var threads = res[1].list;
            expect(threads[0].id).toEqual(ids[0]);
            expect(threads[1].id).toEqual(ids[1]);
            done();
        });
    });
});
