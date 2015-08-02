var config            = require('../../config.js');
var db                = config.db;
var core              = require('../../utils.js');
var _                 = require('lodash');
var utils             = require('./utils.js');
var getMailboxUpdates = require('../../models/mailbox.js').methods.getMailboxUpdates;

describe("getMailboxUpdates method", function () {

    var callId = "#1";
    var res = [];
    var args = {
        accountId: "test@test.com",
        sinceState: "0",
        fetchRecords: null,
        fetchRecordProperties: null
    };

    var createdMailboxes = [];
    var deletedMailboxes = [];

    beforeAll(function (done) {
        var id;
        // create two mailboxes to test
        utils.createMailboxes(2).then(function (ids) {
            createdMailboxes = ids;
        }).then(function () {
            // delete one mailbox to test
            id = _.pullAt(createdMailboxes, 1)[0];
            return db.get(id);
        }).then(function (mailbox) {
            return db.remove(mailbox);
        }).then(function () {
            deletedMailboxes.push(id);
            done();
        });
    });

    afterAll(function (done) {
        utils.cleanup(args.accountId).then(function () {
            done();
        }).catch(function (err) {
            console.log(err);
        });
    });

    it("should return a correct response", function (done) {
        core.executeMethod(getMailboxUpdates, args, callId).then(function (res) {
            expect(res[1].accountId).toEqual(args.accountId);
            expect(res[1].oldState).toEqual(args.sinceState);
            // TODO check res[1].newState
            expect(_.contains(res[1].changed, createdMailboxes[0])).toBe(true);
            expect(_.contains(res[1].removed, deletedMailboxes[0])).toBe(true);
            expect(res[1].onlyCountsChanged).toBe(false);
            done();
        }).catch(function (err) {
            console.log(err);
            done();
        });
    });

    it("should fetchRecords if set", function (done) {
        args.fetchRecords = true;
        core.executeMethod(getMailboxUpdates, args, callId).then(function (res) {
            expect(_.isArray(res[1])).toBe(true);
            expect(res[1][0]).toEqual("mailboxes");
            expect(res[1][2]).toEqual(callId);
            args.fetchRecords = false;
            done();
        });
    });

    it("should set onlyCountsChanged to true", function (done) {
        /** TODO */
        done();
    });

    it("should fetch only the 4 counts properties if onlyCountsChanged is true", function (done) {
        /** TODO */
        done();
    });

});
