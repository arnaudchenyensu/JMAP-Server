var db = require('../../db.js');
var _ = require('lodash');

describe("setMailboxes method", function () {

    var callId = "#1";
    var args = {
        accountId: "",
        ifInState: "",
        create: {},
        update: {},
        destroy: []
    };

    describe("createMailbox method", function () {

        var res = [];

        beforeEach(function () {
            res = [];
            // Valid mailbox object
            args.create.mailbox = {
                id: "",
                parentId: null,
                role: null,
                mayXXX: "",
                totalMessages: 0,
                unreadMessages: 0,
                totalThread: "",
                unreadThread: ""
            };
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
