var db = require('../../db.js');
var _ = require('lodash');

describe("setMailboxes method", function () {

    var args = {
        accountId: "",
        ifInState: "",
        create: {},
        update: {},
        destroy: []
    };

    describe("createMailbox method", function () {

        beforeEach(function () {
            // Valid mailbox object
            args.create['mailbox'] = {
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

        it("should create a mailbox", function () {
            var res = db.setMailboxes(args);
            console.log(JSON.stringify(res));
            expect(_.keys(res.created).length).toBeGreaterThan(0);
            expect(_.keys(res.notCreated).length).toEqual(0);
        });

        it("should have 'id' and 'mustBeOnlyMailbox' property", function () {
            var res = db.setMailboxes(args);
            expect(res.created.mailbox.id).toBeDefined();
            expect(res.created.mailbox.mustBeOnlyMailbox).toBeDefined();
        });

        it("should not create a mailbox if id is present", function () {
            args.create.mailbox.id = "testId";
            var res = db.setMailboxes(args);
            expect(_.keys(res.notCreated).length).toBeGreaterThan(0);
        });

        it("should not create a mailbox if parentId is not valid", function () {
            args.create.mailbox.parentId = "notValid";
            var res = db.setMailboxes(args);
            expect(_.keys(res.notCreated).length).toBeGreaterThan(0);
        });

        it("should not create a mailbox if role is not valid", function () {
            args.create.mailbox.role = "notValid";
            var res = db.setMailboxes(args);
            expect(_.keys(res.notCreated).length).toBeGreaterThan(0);
        });

        it("should not create a mailbox if mustBeOnlyMailbox is present", function () {
            args.create.mailbox.mustBeOnlyMailbox = "notValid";
            var res = db.setMailboxes(args);
            expect(_.keys(res.notCreated).length).toBeGreaterThan(0);
        });

        it("should not create a mailbox if mayXXX are not valid", function () {
            args.create.mailbox.mayReadMessageList = false;
            args.create.mailbox.mayAddMessages = false;
            var res = db.setMailboxes(args);
            expect(_.keys(res.notCreated).length).toBeGreaterThan(0);
        });

        it("should not create a mailbox if totalMessages !== 0", function () {
            args.create.mailbox.totalMessages = 1;
            var res = db.setMailboxes(args);
            expect(_.keys(res.notCreated).length).toBeGreaterThan(0);
        });

        it("should not create a mailbox if unreadMessages !== 0", function () {
            args.create.mailbox.unreadMessages = 1;
            var res = db.setMailboxes(args);
            expect(_.keys(res.notCreated).length).toBeGreaterThan(0);
        });

        it("should not create a mailbox if totalThreads !== 0", function () {
            args.create.mailbox.totalThreads = 1;
            var res = db.setMailboxes(args);
            expect(_.keys(res.notCreated).length).toBeGreaterThan(0);
        });

        it("should not create a mailbox if unreadThreads !== 0", function () {
            args.create.mailbox.unreadThreads = 1;
            var res = db.setMailboxes(args);
            expect(_.keys(res.notCreated).length).toBeGreaterThan(0);
        });

        it("should ignore unknown properties", function () {
            // args.create.mailbox.unknownProperty = "test";
            // var res = db.setMailboxes(args);
            // expect(_.keys(res.notCreated).length).toBeGreaterThan(0);
        });
    });

});
