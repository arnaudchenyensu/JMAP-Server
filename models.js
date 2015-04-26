var _ = require('lodash');
var models = function () {};

models.Account = function (opts) {
    this.name = opts.name || null;
    this.isPrimary = opts.isPrimary || null;
    this.isReadOnly = opts.isReadOnly || null;
    this.hasMail = opts.hasMail || null;
    this.hasContacts = opts.hasContacts || null;
    this.hasCalendars = opts.hasCalendars || null;
    this.capabilities = opts.capabilities || null;
};

models.Mailbox = function (opts, isUpdate) {
    var immutables = ["id", "role"];
    var invalidProperties = [];
    var properties = _.keys(opts);

    var mayXXX = [
        'mayReadMessageList', 'mayAddMessages', 'mayRemoveMessages',
        'mayCreateChild', 'mayRenameMailbox', 'mayDeleteMailbox'
    ];

    var otherProperties = [
        'totalMessages', 'unreadMessages', 'totalThreads', 'unreadThreads'
    ];

    var validRoles = [
        'inbox', 'archive', 'drafts', 'outbox', 'sent',
        'trash', 'spam', 'templates'
    ];

    function isRoleValid(role) {
        if (role === null || _.contains(validRoles, role) || _.startsWith(role, "x-")) {
            return true;
        }
        return false;
        // TODO No two mailboxes may have the same role
    }

    // if create mailbox
    if (!isUpdate) {
        if (opts.id) {
            invalidProperties.push("id");
        }

        if (opts.parentId !== null) {
            // TODO need to check other things, see spec
            invalidProperties.push("parentId");
        }

        if (opts.role) {
            // TODO No two mailboxes may have the same role
            if (!isRoleValid(opts.role)) {
                invalidProperties.push("role");
            }
        }

        if (opts.mustBeOnlyMailbox) {
            invalidProperties.push("mustBeOnlyMailbox");
        }

        properties.forEach(function (property) {
            if (_.contains(mayXXX, property) && opts[property] !== true) {
                invalidProperties.push(property);
            } else if (_.contains(otherProperties, property) && opts[property] !== 0) {
                invalidProperties.push(property);
            }
        });

    // else update
    } else {

    }

    if (invalidProperties.length !==0) {
        // do not create the object
        this.__invalidProperties = invalidProperties;
    } else {
        // If there were no errors, create a mailbox object
        // with defaults values
        this.name = opts.name || null ;
        this.parentId = opts.parentId || null;
        this.role = opts.role || null;
        this.precedence = opts.precedence || null;
        this.mustBeOnlyMailbox = opts.mustBeOnlyMailbox || true;
        this.mayReadMessageList = opts.mayReadMessageList || true;
        this.mayAddMessages = opts.mayAddMessages || true;
        this.mayRemoveMessages = opts.mayRemoveMessages || true;
        this.mayCreateChild = opts.mayCreateChild || true;
        this.mayRenameMailbox = opts.mayRenameMailbox || true;
        this.mayDeleteMailbox = opts.mayDeleteMailbox || true;
        this.totalMessages = opts.totalMessages || 0;
        this.unreadMessages = opts.unreadMessages || 0;
        this.totalThreads = opts.totalThreads || 0;
        this.unreadThreads = opts.unreadThreads || 0;
    }

};

models.Thread = function (opts) {
    this.messageIds = opts.messageIds || [];
};

models.Message = function (opts) {
    this.threadId = opts.threadId || null;
    this.mailboxIds = opts.mailboxIds || [];
    this.inReplyToMessageId = opts.inReplyToMessageId || null;
    this.isUnread = opts.isUnread || null;
    this.isFlagged = opts.isFlagged || null;
    this.isAnswered = opts.isAnswered || null;
    this.isDraft = opts.isDraft || null;
    this.hasAttachment = opts.hasAttachment || null;
    this.rawUrl = opts.rawUrl || null;
    this.headers = opts.headers || [];
    this.from = opts.from || null;
    this.to = opts.to || [];
    this.cc = opts.cc || [];
    this.bcc = opts.bcc || [];
    this.replyTo = opts.replyTo || null;
    this.subject = opts.subject || null;
    this.date = opts.date || null;
    this.size = opts.size || null;
    this.preview = opts.preview || null;
    this.textBody = opts.textBody || null;
    this.htmlBody = opts.htmlBody || null;
    this.attachments = opts.attachments || [];
    this.attachedMessages = opts.attachedMessages || [];
};

models.Emailer = function (opts) {
    this.name = opts.name || null;
    this.email = opts.email || null;
};

models.Attachment = function (opts) {
    this.url = opts.url || null;
    this.type = opts.type || null;
    this.name = opts.name || null;
    this.size = opts.size || null;
    this.isInline = opts.isInline || null;
    this.width = opts.width || null;
    this.height = opts.height || null;
};

models.SearchSnippet = function (opts) {
    this.messageId = opts.messageId || null;
    this.subject = opts.subject || null;
    this.preview = opts.preview || null;
};

models.ContactGroup = function (opts) {
    this.name = opts.name || null;
    this.contactIds = opts.contactIds || [];
};

models.Contact = function (opts) {
    this.isFlagged = opts.isFlagged || null;
    this.avatar = opts.avatar || null;
    this.prefix = opts.prefix || "";
    this.firstName = opts.firstName || "";
    this.lastName = opts.lastName || "";
    this.suffix = opts.suffix || "";
    this.nickname = opts.nickname || "";
    this.birthday = opts.birthday || "0000-00-00";
    this.anniversary = opts.anniversary || "0000-00-00";
    this.company = opts.company || "";
    this.department = opts.department || "";
    this.jobTitle = opts.jobTitle || "";
    this.emails = opts.emails || [];
    this.defaultEmailIndex = opts.defaultEmailIndex || null;
    this.phones = opts.phones || [];
    this.online = opts.online || [];
    this.addresses = opts.addresses || [];
    this.notes = opts.notes || "";
};

models.ContactInformation = function (opts) {
    this.type = opts.type || null;
    this.label = opts.label || null;
    this.value = opts.value || null;
};

models.Address = function (opts) {
    this.type = opts.type || null;
    this.label = opts.label || null;
    this.street = opts.street || null;
    this.locality = opts.locality || null;
    this.region = opts.region || null;
    this.postcode = opts.postcode || null;
    this.country = opts.country || null;
};

models.File = function (opts) {
    this.url = opts.url || null;
    this.type = opts.type || null;
    this.name = opts.name || null;
    this.size = opts.size || null;
};

models.Calendar = function (opts) {
    this.name = opts.name || null;
    this.colour = opts.colour || null;
    this.isVisible = opts.isVisible || null;
};

models.FilterOperator = function (opts) {
    this.operator = opts.operator || null;
    this.conditions = opts.conditions || [];
};

models.FilterCondition = function (opts) {
    this.inCalendars = opts.inCalendars || [];
    this.before = opts.before || null;
    this.after = opts.after || null;
    this.text = opts.text || null;
    this.summary = opts.summary || null;
    this.description = opts.description || null;
    this.location = opts.location || null;
    this.organizer = opts.organizer || null;
    this.attendee = opts.attendee || null;
};

models.CalendarEvent = function (opts) {
    this.calendarId = opts.calendarId || null;
    this.summary = opts.summary || null;
    this.description = opts.description || null;
    this.location = opts.location || null;
    this.showAsFree = opts.showAsFree || null;
    this.isAllDay = opts.isAllDay || null;
    this.utcStart = opts.utcStart || null;
    this.utcEnd = opts.utcEnd || null;
    this.startTimeZone = opts.startTimeZone || null;
    this.endTimeZone = opts.endTimeZone || null;
    this.recurrence = opts.recurrence || null;
    this.inclusions = opts.inclusions || [];
    this.exceptions = opts.exceptions || [];
    this.alerts = opts.alerts || [];
    this.organizer = opts.organizer || null;
    this.attendees = opts.attendees || [];
    this.attachments = opts.attachments || [];
};

models.Recurrence = function (opts) {
    this.frequency = opts.frequency || null;
    this.interval = opts.interval || null;
    this.firstDayOfWeek = opts.firstDayOfWeek || null;
    this.byDay = opts.byDay || [];
    this.byDate = opts.byDate || [];
    this.byMonth = opts.byMonth || [];
    this.byYearDay = opts.byYearDay || [];
    this.byWeekNo = opts.byWeekNo || [];
    this.byHour = opts.byHour || [];
    this.byMinute = opts.byMinute || [];
    this.bySecond = opts.bySecond || [];
    this.bySetPosition = opts.bySetPosition || [];
    this.count = opts.count || null;
    this.until = opts.until || null;
};

models.Alert = function (opts) {
    this.minutesBefore = opts.minutesBefore || null;
    this.type = opts.type || null;
};

models.Participant = function (opts) {
    this.name = opts.name || null;
    this.email = opts.email || null;
    this.isYou = opts.isYou || null;
    this.rsvp = opts.rsvp || "";
};

models.AccountState = function (opts) {
    this.mailboxes = opts.mailboxes || null;
    this.threads = opts.threads || null;
    this.messages = opts.messages || null;
    this.contactGroups = opts.contactGroups || null;
    this.contacts = opts.contacts || null;
    this.calendars = opts.calendars || null;
    this.calendarEvents = opts.calendarEvents || null;
};

module.exports = models;
