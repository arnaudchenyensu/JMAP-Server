var models = require('../../models.js');

describe("A message object", function() {

    var opts = {};
    var message = new models.Message(opts);

    it("has the property threadId", function() {
        expect(message.threadId).toBeDefined();
    });

    it("has the property mailboxIds", function() {
        expect(message.mailboxIds).toBeDefined();
    });

    it("has the property inReplyToMessageId", function() {
        expect(message.inReplyToMessageId).toBeDefined();
    });

    it("has the property isUnread", function() {
        expect(message.isUnread).toBeDefined();
    });

    it("has the property isFlagged", function() {
        expect(message.isFlagged).toBeDefined();
    });

    it("has the property isAnswered", function() {
        expect(message.isAnswered).toBeDefined();
    });

    it("has the property isDraft", function() {
        expect(message.isDraft).toBeDefined();
    });

    it("has the property hasAttachment", function() {
        expect(message.hasAttachment).toBeDefined();
    });

    it("has the property rawUrl", function() {
        expect(message.rawUrl).toBeDefined();
    });

    it("has the property headers", function() {
        expect(message.headers).toBeDefined();
    });

    it("has the property from", function() {
        expect(message.from).toBeDefined();
    });

    it("has the property to", function() {
        expect(message.to).toBeDefined();
    });

    it("has the property cc", function() {
        expect(message.cc).toBeDefined();
    });

    it("has the property bcc", function() {
        expect(message.bcc).toBeDefined();
    });

    it("has the property replyTo", function() {
        expect(message.replyTo).toBeDefined();
    });

    it("has the property subject", function() {
        expect(message.subject).toBeDefined();
    });

    it("has the property date", function() {
        expect(message.date).toBeDefined();
    });

    it("has the property size", function() {
        expect(message.size).toBeDefined();
    });

    it("has the property preview", function() {
        expect(message.preview).toBeDefined();
    });

    it("has the property textBody", function() {
        expect(message.textBody).toBeDefined();
    });

    it("has the property htmlBody", function() {
        expect(message.htmlBody).toBeDefined();
    });

    it("has the property attachments", function() {
        expect(message.attachments).toBeDefined();
    });

    it("has the property attachedMessages", function() {
        expect(message.attachedMessages).toBeDefined();
    });

});
