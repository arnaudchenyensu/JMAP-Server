var db = require('../../db.js');
var _ = require('lodash');

describe("setMailboxes method", function () {

    var callId = "#1";
    var res = [];
    var args = {
        accountId: "test@test.com",
        ifInState: "",
        create: {},
        update: {},
        destroy: []
    };

    var validCreateObject = {
        id: "",
        parentId: null,
        role: null,
        totalMessages: 0,
        unreadMessages: 0,
        totalThread: "",
        unreadThread: ""
    };

    var validUpdateObject = {
        name: "The new name"
    };

    describe("createMailbox method", function () {

        beforeEach(function () {
            res = [];
            args.create.mailbox = _.clone(validCreateObject);
        });

        it("should create a mailbox", function (done) {
            db.setMailboxes(res, args, callId).then(function () {
                expect(_.keys(res[0][1].created).length).toBeGreaterThan(0);
                expect(_.keys(res[0][1].notCreated).length).toEqual(0);
                done();
            });
        });

        it("should have 'id' and 'mustBeOnlyMailbox' property", function (done) {
            db.setMailboxes(res, args, callId).then(function () {
                expect(res[0][1].created.mailbox.id).toBeDefined();
                expect(res[0][1].created.mailbox.mustBeOnlyMailbox).toBeDefined();
                done();
            });
        });

        it("should not create a mailbox if id is present", function (done) {
            args.create.mailbox.id = "testId";
            db.setMailboxes(res, args, callId).then(function () {
                expect(_.keys(res[0][1].notCreated).length).toBeGreaterThan(0);
                done();
            });
        });

        it("should not create a mailbox if parentId is not valid", function (done) {
            args.create.mailbox.parentId = "notValid";
            db.setMailboxes(res, args, callId).then(function () {
                expect(_.keys(res[0][1].notCreated).length).toBeGreaterThan(0);
                done();
            });
        });

        it("should not create a mailbox if role is not valid", function (done) {
            args.create.mailbox.role = "notValid";
            db.setMailboxes(res, args, callId).then(function () {
                expect(_.keys(res[0][1].notCreated).length).toBeGreaterThan(0);
                done();
            });
        });

        it("should not create a mailbox if mustBeOnlyMailbox is present", function (done) {
            args.create.mailbox.mustBeOnlyMailbox = "notValid";
            db.setMailboxes(res, args, callId).then(function () {
                expect(_.keys(res[0][1].notCreated).length).toBeGreaterThan(0);
                done();
            });
        });

        it("should not create a mailbox if mayXXX are not valid", function (done) {
            args.create.mailbox.mayReadMessageList = false;
            args.create.mailbox.mayAddMessages = false;
            db.setMailboxes(res, args, callId).then(function () {
                expect(_.keys(res[0][1].notCreated).length).toBeGreaterThan(0);
                done();
            });
        });

        it("should not create a mailbox if totalMessages !== 0", function (done) {
            args.create.mailbox.totalMessages = 1;
            db.setMailboxes(res, args, callId).then(function () {
                expect(_.keys(res[0][1].notCreated).length).toBeGreaterThan(0);
                done();
            });
        });

        it("should not create a mailbox if unreadMessages !== 0", function (done) {
            args.create.mailbox.unreadMessages = 1;
            db.setMailboxes(res, args, callId).then(function () {
                expect(_.keys(res[0][1].notCreated).length).toBeGreaterThan(0);
                done();
            });
        });

        it("should not create a mailbox if totalThreads !== 0", function (done) {
            args.create.mailbox.totalThreads = 1;
            db.setMailboxes(res, args, callId).then(function () {
                expect(_.keys(res[0][1].notCreated).length).toBeGreaterThan(0);
                done();
            });
        });

        it("should not create a mailbox if unreadThreads !== 0", function (done) {
            args.create.mailbox.unreadThreads = 1;
            db.setMailboxes(res, args, callId).then(function () {
                expect(_.keys(res[0][1].notCreated).length).toBeGreaterThan(0);
                done();
            });
        });

        // TODO
        // it("should ignore unknown properties", function () {
        //     // args.create.mailbox.unknownProperty = "test";
        //     // var res = db.setMailboxes(args);
        //     // expect(_.keys(res.notCreated).length).toBeGreaterThan(0);
        // });
    });

});
