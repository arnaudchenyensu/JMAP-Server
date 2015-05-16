var config  = require('../config.js');
var db      = config.db;
var _       = require('lodash');
var Promise = require('bluebird');

var utils = {};

utils.get = function (response, args, startkey, endkey) {
    // TODO manage state of the server
    response.state = "stateOfTheServer";
    response.list = [];
    response.notFound = [];

    var opts = {};
    opts.include_docs = true;
    if (args !== null && args.ids) {
        opts.keys = args.ids;
    } else {
        opts.startkey = startkey;
        opts.endkey = endkey;
    }

    return db.allDocs(opts).then(function (r) {
        r.rows.forEach(function (row) {
            if (row.error === "not_found") {
                response.notFound.push(row.key);
            } else if (!row.value.deleted) {
                if (args.properties && args.properties.length !== 0) {
                    response.list.push(_.pick(row.doc, args.properties));
                } else {
                    response.list.push(row.doc);
                }
                var i = response.list.length - 1;
                response.list[i].id = row.id;
                delete response.list[i]._id;
                delete response.list[i]._rev;
            }
        });
        if (response.notFound.length === 0)
            response.notFound = null;
        return response;
    }).catch(function (err) {
        console.log(err);
    });
};

utils.set = function (response, args, model) {
    var promises = [];

    if (args.ifInState) {
        // TODO check state
    }

    // create Mailboxes
    if (args.create) {
        response.notCreated = {};
        response.created = {};
        _.keys(args.create).forEach(function (creationId) {
            promises.push(create(response, creationId, args.create[creationId], model));
        });
    }

    // update Mailboxes
    if (args.update) {
        response.notUpdated = {};
        response.updated = [];
        _.keys(args.update).forEach(function (mailboxId) {
            promises.push(update(response, mailboxId, args.update[mailboxId], model));
        });
    }

    // destroy Mailboxes
    if (args.destroy) {
        response.notDestroyed = {};
        response.destroyed = {};
        args.destroy.forEach(function (mailboxId) {
            promises.push(destroy(response, mailboxId, model));
        });
    }

    return Promise.all(promises);
};

var create = function (response, creationId, obj, model) {
    var setError = {
        type: "invalidProperties",
        description: undefined,
        properties: []
    };

    var newObj = model.create(obj);

    if (newObj.__invalidProperties) {
        setError.properties = newObj.__invalidProperties;
        response.notCreated[creationId] = setError;
        return Promise.resolve(setError);
    } else {
        var _id = model.id(response.accountId),
            mustBeOnlyMailbox = true;
        newObj._id = _id;
        newObj.mustBeOnlyMailbox = true;
        return db.put(newObj).then(function () {
            response.created[creationId] = {
                id: _id,
                mustBeOnlyMailbox: mustBeOnlyMailbox
            };
            return newObj;
        }).catch(function (err) {
            console.log(err);
        });
    }
};

var update = function (response, objId, updatedProperties, model) {
    var setError = {
        type: "invalidProperties",
        description: undefined,
        properties: []
    };

    // TODO notFound error for the id
    return db.get(objId).then(function (obj) {
        var updatedObj = model.update(obj, updatedProperties);
        if (updatedObj.__invalidProperties) {
            setError.properties = updatedObj.__invalidProperties;
            response.notUpdated[objId] = setError;
            return Promise.resolve(setError);
        } else {
            return db.put(obj).then(function () {
                response.updated.push(objId);
            }).catch(function (err) {
                console.log(err);
            });
        }
    });
};

var destroy = function (response, objId) {
    // TODO
};

module.exports = utils;
