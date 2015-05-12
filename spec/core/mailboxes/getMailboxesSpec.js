var config  = require('../../../config.js');
var core    = require('../../../core.js');
var _       = require('lodash');
var utils = require('./utils.js');

describe("getMailboxes method", function () {

    var callId = "#1";
    var res = [];
    var args = {
        accountId: "test@test.com",
        ids: null,
        properties: []
    };
    var createdMailboxes = [];

    beforeAll(function (done) {
        // create two mailboxes to test
        utils.createMailboxes(2).then(function (ids) {
            createdMailboxes = ids;
            done();
        });
    });

    beforeEach(function () {
        res = [];
        args.accountId = "test@test.com";
        args.ids = null;
        args.properties = [];
    });

    afterAll(function (done) {
        utils.cleanup().then(function () {
            done();
        });
    });

    it("should return a correct response", function (done) {
        core.getMailboxes(res, args, callId).then(function () {
            expect(res[0][1].accountId).toBeDefined();
            expect(res[0][1].state).toBeDefined();
            expect(res[0][1].list).toBeDefined();
            expect(res[0][1].notFound).toBeNull();
            done();
        });
    });

    // TODO
    it("should return a correct response even if accountId is null", function (done) {
        done();
    });

    // TODO
    it("should return a correct response even if accountId is omitted", function (done) {
        done();
    });

    it("should return only mailboxes specified by ids", function (done) {
        args.ids = [createdMailboxes[0]];
        core.getMailboxes(res, args, callId).then(function () {
            expect(res[0][1].list.length).toEqual(1);
            done();
        });
    });

    it("should return all mailboxes if ids is null", function (done) {
        args.ids = null;
        core.getMailboxes(res, args, callId).then(function () {
            expect(res[0][1].list.length).toEqual(createdMailboxes.length);
            done();
        });
    });

    it("should return all mailboxes if ids is omitted", function (done) {
        delete args.ids;
        core.getMailboxes(res, args, callId).then(function () {
            expect(res[0][1].list.length).toEqual(createdMailboxes.length);
            done();
        });
    });

    it("should return res.notFound !== null if some ids were not found", function (done) {
        args.ids = ["falseId"];
        core.getMailboxes(res, args, callId).then(function () {
            expect(res[0][1].notFound).not.toBe(null);
            expect(res[0][1].notFound.length).toBeGreaterThan(0);
            expect(res[0][1].list.length).toEqual(0);
            done();
        });
    });

    it("should return only id and properties specified by properties", function (done) {
        args.properties = ['name', 'parentId'];
        core.getMailboxes(res, args, callId).then(function () {
            var mailbox = res[0][1].list[0];
            expect(mailbox.id).toBeDefined();
            expect(_.keys(mailbox).length).toEqual(3);
            done();
        });
    });

    it("should return all properties if properties is null", function (done) {
        args.properties = null;
        core.getMailboxes(res, args, callId).then(function () {
            var mailbox = res[0][1].list[0];
            expect(_.keys(mailbox).length).toEqual(16);
            done();
        });
    });

    it("should return all properties if properties is omitted", function (done) {
        delete args.properties;
        core.getMailboxes(res, args, callId).then(function () {
            var mailbox = res[0][1].list[0];
            expect(_.keys(mailbox).length).toEqual(16);
            done();
        });
    });

    it("should ignore unknown properties", function (done) {
        args.properties = ['unknownProperty'];
        core.getMailboxes(res, args, callId).then(function () {
            var mailbox = res[0][1].list[0];
            expect(_.keys(mailbox).length).toEqual(1); // id is still return
            done();
        });
    });

    // TODO
    it("should return accountNotFound if accountId is invalid", function (done) {
        done();
    });

    // TODO
    it("shoud return accountNoMail if the account does not contain any mail data", function (done) {
        done();
    });

    // TODO
    it("should return invalidArguments if the request does not include one of the required args", function (done) {
        done();
    });

    // TODO
    it("should return invalidArguments if one of the arguments is of the wrong type", function (done) {
        done();
    });

    // TODO
    it("should return invalidArguments if one of the arguments is invalid", function (done) {
        done();
    });
});
