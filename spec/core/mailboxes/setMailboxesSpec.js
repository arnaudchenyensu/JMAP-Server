var core         = require('../../../utils.js');
var _            = require('lodash');
var utils        = require('./utils.js');
var setMailboxes = require('../../../models/mailbox.js').methods.setMailboxes;

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
        parentId: null,
        role: null
    };

    var validUpdateObject = {
        name: "The new name"
    };

    afterAll(function (done) {
        utils.cleanup(args.accountId).then(function () {
            done();
        }).catch(function (err) {
            console.log(err);
        });
    });

    describe("createMailbox method", function () {

        beforeEach(function () {
            res = [];
            args.create.mailbox = _.clone(validCreateObject);
        });

        it("should create a mailbox", function (done) {
            core.executeMethod(setMailboxes, args, callId).then(function (res) {
                expect(_.keys(res[1].created).length).toBeGreaterThan(0);
                expect(_.keys(res[1].notCreated).length).toEqual(0);
                done();
            });
        });

        it("should have 'id' and 'mustBeOnlyMailbox' property", function (done) {
            core.executeMethod(setMailboxes, args, callId).then(function (res) {
                expect(res[1].created.mailbox.id).toBeDefined();
                expect(res[1].created.mailbox.mustBeOnlyMailbox).toBeDefined();
                done();
            });
        });

        it("should not create a mailbox if id is present", function (done) {
            args.create.mailbox.id = "testId";
            core.executeMethod(setMailboxes, args, callId).then(function (res) {
                expect(_.keys(res[1].notCreated).length).toBeGreaterThan(0);
                done();
            });
        });

        it("should not create a mailbox if parentId is not valid", function (done) {
            args.create.mailbox.parentId = "notValid";
            core.executeMethod(setMailboxes, args, callId).then(function (res) {
                expect(_.keys(res[1].notCreated).length).toBeGreaterThan(0);
                done();
            });
        });

        it("should not create a mailbox if role is not valid", function (done) {
            args.create.mailbox.role = "notValid";
            core.executeMethod(setMailboxes, args, callId).then(function (res) {
                expect(_.keys(res[1].notCreated).length).toBeGreaterThan(0);
                done();
            });
        });

        it("should not create a mailbox if mustBeOnlyMailbox is present", function (done) {
            args.create.mailbox.mustBeOnlyMailbox = "notValid";
            core.executeMethod(setMailboxes, args, callId).then(function (res) {
                expect(_.keys(res[1].notCreated).length).toBeGreaterThan(0);
                done();
            });
        });

        it("should not create a mailbox if mayXXX are not valid", function (done) {
            args.create.mailbox.mayReadMessageList = false;
            args.create.mailbox.mayAddMessages = false;
            core.executeMethod(setMailboxes, args, callId).then(function (res) {
                expect(_.keys(res[1].notCreated).length).toBeGreaterThan(0);
                done();
            });
        });

        it("should not create a mailbox if totalMessages !== 0", function (done) {
            args.create.mailbox.totalMessages = 1;
            core.executeMethod(setMailboxes, args, callId).then(function (res) {
                expect(_.keys(res[1].notCreated).length).toBeGreaterThan(0);
                done();
            });
        });

        it("should not create a mailbox if unreadMessages !== 0", function (done) {
            args.create.mailbox.unreadMessages = 1;
            core.executeMethod(setMailboxes, args, callId).then(function (res) {
                expect(_.keys(res[1].notCreated).length).toBeGreaterThan(0);
                done();
            });
        });

        it("should not create a mailbox if totalThreads !== 0", function (done) {
            args.create.mailbox.totalThreads = 1;
            core.executeMethod(setMailboxes, args, callId).then(function (res) {
                expect(_.keys(res[1].notCreated).length).toBeGreaterThan(0);
                done();
            });
        });

        it("should not create a mailbox if unreadThreads !== 0", function (done) {
            args.create.mailbox.unreadThreads = 1;
            core.executeMethod(setMailboxes, args, callId).then(function (res) {
                expect(_.keys(res[1].notCreated).length).toBeGreaterThan(0);
                done();
            });
        });

        // TODO
        // it("should ignore unknown properties", function () {
        //     // args.create.mailbox.unknownProperty = "test";
        //     // var res = core.executeMethod(args);
        //     // expect(_.keys(res.notCreated).length).toBeGreaterThan(0);
        // });
    });

    describe("updateMailbox method", function () {

        var id;

        beforeEach(function (done) {
            res = [];
            args.create.mailbox = _.clone(validCreateObject);
            core.executeMethod(setMailboxes, args, callId).then(function (res) {
                id = res[1].created.mailbox.id;
                args.update = {};
                args.update[id] = _.clone(validUpdateObject);
                res = [];
                args.create = {};
                done();
            });
        });

        it("should update a mailbox", function (done) {
            core.executeMethod(setMailboxes, args, callId).then(function (res) {
                expect(res[1].updated.length).toEqual(1);
                expect(_.keys(res[1].notUpdated).length).toEqual(0);
                done();
            });
        });

        it("should not update a mailbox when name is not valid", function (done) {
            // TODO set name to a not valid UTF-8 string
            args.update[id].name = "not valid";
            core.executeMethod(setMailboxes, args, callId).then(function (res) {
                expect(res[1].updated.length).toEqual(0);
                expect(_.keys(res[1].notUpdated).length).toEqual(1);
                done();
            });
        });

        it("should not update a mailbox when parentId is not valid", function (done) {
            args.update[id].parentId = "not valid";
            core.executeMethod(setMailboxes, args, callId).then(function (res) {
                expect(res[1].updated.length).toEqual(0);
                expect(_.keys(res[1].notUpdated).length).toEqual(1);
                done();
            });
        });

        it("should not update a mailbox when id is set", function (done) {
            args.update[id].id = "something";
            core.executeMethod(setMailboxes, args, callId).then(function (res) {
                expect(res[1].updated.length).toEqual(0);
                expect(_.keys(res[1].notUpdated).length).toEqual(1);
                done();
            });
        });

        it("should not update a mailbox when role is set", function (done) {
            args.update[id].role = "something";
            core.executeMethod(setMailboxes, args, callId).then(function (res) {
                expect(res[1].updated.length).toEqual(0);
                expect(_.keys(res[1].notUpdated).length).toEqual(1);
                done();
            });
        });

        it("should not update a mailbox when mustBeOnlyMailbox is set", function (done) {
            args.update[id].mustBeOnlyMailbox = "something";
            core.executeMethod(setMailboxes, args, callId).then(function (res) {
                expect(res[1].updated.length).toEqual(0);
                expect(_.keys(res[1].notUpdated).length).toEqual(1);
                done();
            });
        });

        it("should not update a mailbox when mayReadMessageList is set", function (done) {
            args.update[id].mayReadMessageList = "something";
            core.executeMethod(setMailboxes, args, callId).then(function (res) {
                expect(res[1].updated.length).toEqual(0);
                expect(_.keys(res[1].notUpdated).length).toEqual(1);
                done();
            });
        });

        it("should not update a mailbox when mayAddMessages is set", function (done) {
            args.update[id].mayAddMessages = "something";
            core.executeMethod(setMailboxes, args, callId).then(function (res) {
                expect(res[1].updated.length).toEqual(0);
                expect(_.keys(res[1].notUpdated).length).toEqual(1);
                done();
            });
        });

        it("should not update a mailbox when mayRemoveMessages is set", function (done) {
            args.update[id].mayRemoveMessages = "something";
            core.executeMethod(setMailboxes, args, callId).then(function (res) {
                expect(res[1].updated.length).toEqual(0);
                expect(_.keys(res[1].notUpdated).length).toEqual(1);
                done();
            });
        });

        it("should not update a mailbox when mayCreateChild is set", function (done) {
            args.update[id].mayCreateChild = "something";
            core.executeMethod(setMailboxes, args, callId).then(function (res) {
                expect(res[1].updated.length).toEqual(0);
                expect(_.keys(res[1].notUpdated).length).toEqual(1);
                done();
            });
        });

        it("should not update a mailbox when mayRenameMailbox is set", function (done) {
            args.update[id].mayRenameMailbox = "something";
            core.executeMethod(setMailboxes, args, callId).then(function (res) {
                expect(res[1].updated.length).toEqual(0);
                expect(_.keys(res[1].notUpdated).length).toEqual(1);
                done();
            });
        });

        it("should not update a mailbox when mayDeleteMailbox is set", function (done) {
            args.update[id].mayDeleteMailbox = "something";
            core.executeMethod(setMailboxes, args, callId).then(function (res) {
                expect(res[1].updated.length).toEqual(0);
                expect(_.keys(res[1].notUpdated).length).toEqual(1);
                done();
            });
        });

        it("should not update a mailbox when totalMessages is set", function (done) {
            args.update[id].totalMessages = "something";
            core.executeMethod(setMailboxes, args, callId).then(function (res) {
                expect(res[1].updated.length).toEqual(0);
                expect(_.keys(res[1].notUpdated).length).toEqual(1);
                done();
            });
        });

        it("should not update a mailbox when unreadMessages is set", function (done) {
            args.update[id].unreadMessages = "something";
            core.executeMethod(setMailboxes, args, callId).then(function (res) {
                expect(res[1].updated.length).toEqual(0);
                expect(_.keys(res[1].notUpdated).length).toEqual(1);
                done();
            });
        });

        it("should not update a mailbox when totalThreads is set", function (done) {
            args.update[id].totalThreads = "something";
            core.executeMethod(setMailboxes, args, callId).then(function (res) {
                expect(res[1].updated.length).toEqual(0);
                expect(_.keys(res[1].notUpdated).length).toEqual(1);
                done();
            });
        });

        it("should not update a mailbox when unreadThreads is set", function (done) {
            args.update[id].unreadThreads = "something";
            core.executeMethod(setMailboxes, args, callId).then(function (res) {
                expect(res[1].updated.length).toEqual(0);
                expect(_.keys(res[1].notUpdated).length).toEqual(1);
                done();
            });
        });
    });
});
