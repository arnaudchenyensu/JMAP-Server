var config  = require('./config.js');
var db      = config.db;
var _       = require('lodash');
var Promise = require('bluebird');

var utils = {};

/**
 * Use for checking type. Basic wrapper for some lodash method (_.isString, _.isNumber, ...).
 *
 * @static
 * @memberOf utils
 * @param   {*}       val  The value to test.
 * @param   {string}  type The type to assert.
 * @returns {Boolean}      Returns true if val is of the defined type.
 */
utils.assert = function (val, type) {
    type = type.toLowerCase();
    switch (type) {
        case "string":
            return _.isString(val);
        case "number":
            return _.isNumber(val);
        case "boolean":
            return _.isBoolean(val);
        case "array":
            return _.isArray(val);
        case "object":
            return _.isPlainObject(val);
        case "null":
            return _.isNull(val);
    }
};

/**
 * Check that `val` is one of the type in `types`.
 *
 * @static
 * @memberOf utils
 * @param   {*}         val   Value to check.
 * @param   {string[]}  types Array of string types ("string", "boolean", ...).
 * @returns {Boolean}         Return true if `val` is one of the type.
 */
utils.isCorrectType = function (val, types) {
    return _.any(types, function (type) {
        return utils.assert(val, type);
    });
};

/**
 * Execute `method`.
 *
 * @static
 * @memberOf utils
 * @param   {Object}  method Method like `mailbox.methods.getMailboxes`.
 * @param   {Object}  req    The request send, e.g `{accountId: "", ids: [], ...}`.
 * @param   {string}  callId The callId send.
 * @returns {Promise}        Promise which resolve with [responseName, response, callId].
 */
utils.executeMethod = function (method, req, callId) {
    var err = {
        type: "invalidArguments"
    };

    // Default Value
    _.forEach(method.request, function (val, key) {
        if (req[key] === undefined)
            req[key] = _.clone(val.defaultValue);
    });

    // Type checks
    var isAllCorrectType = _.every(method.request, function (val, key) {
        if (!utils.isCorrectType(req[key], val.types)) {
            err.description = "Wrong type for argument " + key + ". Possible types are " + val.types.join(', ') + ".";
            return false;
        }
        return true;
    });
    if (!isAllCorrectType)
        return Promise.resolve(["error", err, callId]);

    // Execute all needed functions before the request in DB
    var opts = {},
        res = {};
    _.invoke(method.request, 'before', req, opts, res);
    _.invoke(method.response, 'before', req, opts, res);

    // Execute all needed functions after the request in DB
    return method.func(opts).then(function (result) {
        // Default Value
        _.forEach(method.response, function (val, key) {
            if (res[key] === undefined) {
                res[key] = _.clone(val.defaultValue);
            }
        });
        _.invoke(method.request, 'after', req, res, result);
        _.invoke(method.response, 'after', req, res, result);

        /** if an implicit call is made during getFooUpdates */
        var implicitCall = res._implicitCall;
        if (implicitCall) {
            delete res._implicitCall;
            return implicitCall.then(function (r) {
                r[2] = callId;
                return [[method.responseName, res, callId], r];
            });
        } else {
            return [method.responseName, res, callId];
        }
    });
};

/**
 * Execute a get request in the database.
 *
 * @static
 * @memberOf utils
 * @param   {Object} opts Options for the request. By default `opts.include_docs = true`.
 * @returns {Promise}     Promise which resolves with {errors: {}, deleted: {}, rows: {}}.
 */
utils.get = function (opts) {
    opts.include_docs = true;
    return db.allDocs(opts).then(function (result) {
        var res = {
            errors: [],
            deleted: [],
            rows: []
        };
        _.forEach(result.rows, function (row) {
            if (row.error) {
                res.errors.push(row);
            } else if (row.value && row.value.deleted) {
                res.deleted.push(row);
            } else {
                utils.formatRow(row);
                res.rows.push(row);
            }
        });
        return res;
    });
};

/**
 * Execute a set request in the database.
 *
 * @static
 * @memberOf utils
 * @param   {Object}  opts Options for the request -- `opts.accountId`, `opts.model`,
 *                         `opts.create`, `opts.update`, `opts.destroy`.
 * @returns {Promise}      Promise which resolves with `res.accountId`, `res.notCreated`, `res.created`,
 *                         `res.notUpdated`, `res.updated`, `res.notDestroyed`, `res.destroyed`.
 */
utils.set = function (opts) {
    var promises = [];
    var res = {accountId: opts.accountId};
    var model = opts.model;

    // create Obj
    if (opts.create) {
        res.notCreated = {};
        res.created = {};
        _.forEach(opts.create, function (obj, creationId) {
            promises.push(utils.create(res, creationId, obj, model));
        });
    }

    // update Obj
    if (opts.update) {
        res.notUpdated = {};
        res.updated = [];
        _.forEach(opts.update, function (obj, objId) {
            promises.push(utils.update(res, objId, obj, model));
        });
    }

    // destroy Obj
    if (opts.destroy) {
        res.notDestroyed = {};
        res.destroyed = [];
        _.forEach(opts.destroy, function (objId) {
            promises.push(utils.destroy(res, objId));
        });
    }

    return Promise.all(promises).then(function () {
        return res;
    });
};

/**
 * Iterate over propertiesModel and invoke each check in checks.
 * Stop check iteration for a property as soon as a check does not pass.
 * Current possible checks are:
 * - `immutable`
 * - `serverSetOnly`
 * - `defaultValue`: set default value if `value === undefined`
 * - `checkTypes`
 * - any string that correspond to a property of `propertiesModel`
 *
 * @static
 * @memberOf utils
 * @param   {Object}   propertiesModel Properties' model to iterate over.
 * @param   {Object}   properties      The properties to check.
 * @param   {string[]} checks          Each check to invoke.
 * @returns {Object}                   `{error: true/false, description: "", properties: []}`.
 * @example
 *
 * utils.check(models.mailbox, properties, ["serverSetOnly", "checkTypes", "checksWhenCreate"]);
 * // => return {error: true, description: "id is serverSetOnly", properties: ["id"]}
 */
utils.check = function (propertiesModel, properties, checks) {
    var res = {
        error: false,
        description: "",
        properties: []
    };

    _.forEach(propertiesModel, function (property, propertyName) {
        var val = properties[propertyName];
        // break as soon as a check does not pass
        _.any(checks, function (check) {
            if (check === "immutable") {
                if (property.immutable && val !== undefined) {
                    res.description += propertyName + " is immutable.";
                    res.properties.push(propertyName);
                    return true;
                }
            } else if (check === "serverSetOnly") {
                if (property.serverSetOnly && val !== undefined) {
                    res.description += propertyName + " can only be set by the server.";
                    res.properties.push(propertyName);
                    return true;
                }
            } else if (check === "defaultValue") {
                if (val === undefined) {
                    properties[propertyName] = _.clone(property.defaultValue);
                    return true;
                }
            } else if (check === "checkTypes") {
                if (!utils.isCorrectType(val, property.types)) {
                    res.description = "Wrong type for argument " + propertyName + ". Possible types are " + property.types.join(', ') + ".";
                    res.properties.push(propertyName);
                    return true;
                }
            } else {
                // break as soon as a check does not pass
                return _.any(property[check], function (c) {
                    var checkRes = c(val);
                    if (checkRes.error) {
                        res.description += propertyName + " " + checkRes.description;
                        res.properties.push(propertyName);
                        return true;
                    }
                });
            }
        });
    });

    if (res.properties.length !== 0)
        res.error = true;

    return res;
};

/**
 * Create `obj` in database.
 *
 * @static
 * @memberOf utils
 * @param   {Object}  result     Result object from `utils.set`.
 * @param   {string}  creationId The creationId given at the request.
 * @param   {Object}  obj        The object to create.
 * @param   {Object}  model      The model used to validate `obj`.
 * @returns {Promise}            Promise which resolves with `setError` or
 *                               the object created.
 */
utils.create = function (result, creationId, obj, model) {
    var setError = {
        type: "invalidProperties",
        description: "",
        properties: []
    };
    // keep only known properties
    obj = _.pick(obj, _.keys(model.properties));
    // check obj
    var checkRes = utils.check(model.properties, obj, ["serverSetOnly", "defaultValue", "checkTypes", "checks", "checksWhenCreate"]);

    if (checkRes.error) {
        setError.description = checkRes.description;
        setError.properties = checkRes.properties;
        result.notCreated[creationId] = setError;
        return Promise.resolve(setError);
    } else {
        // create obj
        obj._id = model.id(result.accountId);
        return db.put(obj).then(function () {
            // replace _id by id
            obj.id = obj._id;
            delete obj._id;
            result.created[creationId] = obj;
            return obj;
        }).catch(function (err) {
            console.log(err);
        });
    }
};

/**
 * Update an object in database.
 *
 * @static
 * @memberOf utils
 * @param   {Object}  result            Result object from utils.set.
 * @param   {string}  objId             Id of the object in database.
 * @param   {Object}  updatedProperties The properties to update.
 * @param   {Object}  model             The model used to validate `updatedProperties`.
 * @returns {Promise}                   Promise which resolves with `setError` or `objId`.
 */
utils.update = function (result, objId, updatedProperties, model) {
    var setError = {
        type: "invalidProperties",
        description: "",
        properties: []
    };

    // keep only known properties
    updatedProperties = _.pick(updatedProperties, _.keys(model.properties));
    // keep only properties' model updated
    var propertiesModel = _.pick(model.properties, _.keys(updatedProperties));
    // check updatedProperties
    var checkRes = utils.check(propertiesModel, updatedProperties, ["immutable", "serverSetOnly", "checkTypes", "checks", "checksWhenUpdate"]);

    if (checkRes.error) {
        setError.description = checkRes.description;
        setError.properties = checkRes.properties;
        result.notUpdated[objId] = setError;
        return Promise.resolve(setError);
    } else {
        // TODO notFound error for the id
        return db.get(objId).then(function (obj) {
            _.forEach(updatedProperties, function (property, propertyName) {
                obj[propertyName] = property;
            });
            return obj;
        }).then(function (obj) {
            return db.put(obj);
        }).then(function () {
            result.updated.push(objId);
            return objId;
        }).catch(function (err) {
            console.log(err);
        });
    }
};

/**
 * Destroy a doc.
 * @param   {Object}   result Result object from utils.set.
 * @param   {string}   objId  Id of the object in database.
 * @return  {Promise}         Promise which resolve by the value
 *                            returns by `db.remove()`.
 */
utils.destroy = function (result, objId) {
    return db.get(objId).then(function(doc) {
        return db.remove(doc);
    }).then(function (res) {
        if (res.ok) {
            result.destroyed.push(objId);
        } else {
            result.notDestroyed[objId] = {
                description: res
            };
            // TODO - accountNotFound, accountNoMail, ...
        }
        return res;
    }).catch(function (err) {
        console.log(err);
    });
};

utils.getUpdates = function (opts) {
    /** TODO: handle onlyCountsChanged */
    return db.changes({
        filter: 'mydesign/getUpdatesFilter',
        since: opts.sinceState,
        query_params: {
            startkey: opts.startkey,
            _: _
        }
    });
};

/**
 * Replace `row.doc._id` by `row.doc.id` and delete `row.doc._rev`.
 *
 * @static
 * @memberOf utils
 * @param  {Object} row A row as PouchDB will return for a get request.
 * @example
 *
 * var row = {
 *     doc: {
 *         _id: "myId",
 *         _rev: "myRev",
 *         ...
 *     }
 * };
 *
 * formatRow(row);
 * // => {doc: {id: "myId", ...}}
 */
utils.formatRow = function (row) {
    row.doc.id = row.doc._id;
    delete row.doc._id;
    delete row.doc._rev;
    // return row;
};

module.exports = utils;
