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

    describe("updateMailbox method", function () {

        var id;

        beforeEach(function (done) {
            res = [];
            args.create.mailbox = _.clone(validCreateObject);
            db.setMailboxes(res, args, callId).then(function () {
                id = res[0][1].created.mailbox.id;
                args.update = {};
                args.update[id] = _.clone(validUpdateObject);
                res = [];
                args.create = {};
                done();
            });
        });

        it("should update a mailbox", function (done) {
            db.setMailboxes(res, args, callId).then(function () {
                expect(res[0][1].updated.length).toEqual(1);
                expect(_.keys(res[0][1].notUpdated).length).toEqual(0);
                done();
            });
        });

        it("should not update a mailbox when name is not valid", function (done) {
            // TODO set name to a not valid UTF-8 string
            args.update[id].name = "not valid";
            db.setMailboxes(res, args, callId).then(function () {
                expect(res[0][1].updated.length).toEqual(0);
                expect(_.keys(res[0][1].notUpdated).length).toEqual(1);
                done();
            });
        });

        it("should not update a mailbox when parentId is not valid", function (done) {
            args.update[id].parentId = "not valid";
            db.setMailboxes(res, args, callId).then(function () {
                expect(res[0][1].updated.length).toEqual(0);
                expect(_.keys(res[0][1].notUpdated).length).toEqual(1);
                done();
            });
        });

        it("should not update a mailbox when id is set", function (done) {
            args.update[id].id = "something";
            db.setMailboxes(res, args, callId).then(function () {
                expect(res[0][1].updated.length).toEqual(0);
                expect(_.keys(res[0][1].notUpdated).length).toEqual(1);
                done();
            });
        });

        it("should not update a mailbox when role is set", function (done) {
            args.update[id].role = "something";
            db.setMailboxes(res, args, callId).then(function () {
                expect(res[0][1].updated.length).toEqual(0);
                expect(_.keys(res[0][1].notUpdated).length).toEqual(1);
                done();
            });
        });

        it("should not update a mailbox when mustBeOnlyMailbox is set", function (done) {
            args.update[id].mustBeOnlyMailbox = "something";
            db.setMailboxes(res, args, callId).then(function () {
                expect(res[0][1].updated.length).toEqual(0);
                expect(_.keys(res[0][1].notUpdated).length).toEqual(1);
                done();
            });
        });

        it("should not update a mailbox when mayReadMessageList is set", function (done) {
            args.update[id].mayReadMessageList = "something";
            db.setMailboxes(res, args, callId).then(function () {
                expect(res[0][1].updated.length).toEqual(0);
                expect(_.keys(res[0][1].notUpdated).length).toEqual(1);
                done();
            });
        });

        it("should not update a mailbox when mayAddMessages is set", function (done) {
            args.update[id].mayAddMessages = "something";
            db.setMailboxes(res, args, callId).then(function () {
                expect(res[0][1].updated.length).toEqual(0);
                expect(_.keys(res[0][1].notUpdated).length).toEqual(1);
                done();
            });
        });

        it("should not update a mailbox when mayRemoveMessages is set", function (done) {
            args.update[id].mayRemoveMessages = "something";
            db.setMailboxes(res, args, callId).then(function () {
                expect(res[0][1].updated.length).toEqual(0);
                expect(_.keys(res[0][1].notUpdated).length).toEqual(1);
                done();
            });
        });

        it("should not update a mailbox when mayCreateChild is set", function (done) {
            args.update[id].mayCreateChild = "something";
            db.setMailboxes(res, args, callId).then(function () {
                expect(res[0][1].updated.length).toEqual(0);
                expect(_.keys(res[0][1].notUpdated).length).toEqual(1);
                done();
            });
        });

        it("should not update a mailbox when mayRenameMailbox is set", function (done) {
            args.update[id].mayRenameMailbox = "something";
            db.setMailboxes(res, args, callId).then(function () {
                expect(res[0][1].updated.length).toEqual(0);
                expect(_.keys(res[0][1].notUpdated).length).toEqual(1);
                done();
            });
        });

        it("should not update a mailbox when mayDeleteMailbox is set", function (done) {
            args.update[id].mayDeleteMailbox = "something";
            db.setMailboxes(res, args, callId).then(function () {
                expect(res[0][1].updated.length).toEqual(0);
                expect(_.keys(res[0][1].notUpdated).length).toEqual(1);
                done();
            });
        });

        it("should not update a mailbox when totalMessages is set", function (done) {
            args.update[id].totalMessages = "something";
            db.setMailboxes(res, args, callId).then(function () {
                expect(res[0][1].updated.length).toEqual(0);
                expect(_.keys(res[0][1].notUpdated).length).toEqual(1);
                done();
            });
        });

        it("should not update a mailbox when unreadMessages is set", function (done) {
            args.update[id].unreadMessages = "something";
            db.setMailboxes(res, args, callId).then(function () {
                expect(res[0][1].updated.length).toEqual(0);
                expect(_.keys(res[0][1].notUpdated).length).toEqual(1);
                done();
            });
        });

        it("should not update a mailbox when totalThreads is set", function (done) {
            args.update[id].totalThreads = "something";
            db.setMailboxes(res, args, callId).then(function () {
                expect(res[0][1].updated.length).toEqual(0);
                expect(_.keys(res[0][1].notUpdated).length).toEqual(1);
                done();
            });
        });

        it("should not update a mailbox when unreadThreads is set", function (done) {
            args.update[id].unreadThreads = "something";
            db.setMailboxes(res, args, callId).then(function () {
                console.log(args);
                expect(res[0][1].updated.length).toEqual(0);
                expect(_.keys(res[0][1].notUpdated).length).toEqual(1);
                done();
            });
        });
    });
});
