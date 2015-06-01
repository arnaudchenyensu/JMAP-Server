var config  = require('./config.js');
var db      = config.db;
var _       = require('lodash');
var Promise = require('bluebird');

var utils = {};

utils.assert = function (val, type) {
    type = type.toLowerCase();
    switch (type) {
        case "string":
            return _.isString(val);
        case "array":
            return _.isArray(val);
        case "object":
            return _.isPlainObject(val);
        case "null":
            return _.isNull(val);
    }
};

// pattern = {
//     type: [],
//     defaultValue: ,
//     checks: [],
//     func: []
// }
utils.checkObj = function (val, pattern) {
    var errors = [];

    if (val === undefined)
        val = pattern.defaultValue;

    if (!isCorrectType(val, pattern.types))
        return {
            error: "invalidArguments",
            description: "Wrong type. Possible type is " + pattern.types.join(', ')
        };

    // TODO do all the checks
    // var len = pattern.checks.length;
    // for (var i = 0; i < len; i++) {
    //     if (pattern.checks[i](val)) {
    //         return {error: "all checks did not pass"};
    //     }
    // }

    // TODO execute all the funcs?
    // _.forEach(pattern.func, function (f) {
    //     val = f(val);
    // });

    return {val: val};
};

utils.isCorrectType = function (val, types) {
    return _.any(types, function (type) {
        return utils.assert(val, type);
    });
};

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
    var opts = {};
    _.invoke(method.request, 'before', req, opts);
    _.invoke(method.response, 'before', req, opts);

    // Execute all needed functions after the request in DB
    return method.func(opts).then(function (result) {
        var res  = {};
        // Default Value
        _.forEach(method.response, function (val, key) {
            if (res[key] === undefined)
                res[key] = _.clone(val.defaultValue);
        });
        _.invoke(method.request, 'after', req, res, result);
        _.invoke(method.response, 'after', req, res, result);
        return [method.responseName, res, callId];
    });
};

utils.get = function (opts) {
    opts.include_docs = true;
    return db.allDocs(opts).then(function (result) {
        var res = {
            errors: [],
            rows: []
        };
        _.forEach(result.rows, function (row) {
            if (row.error) {
                res.errors.push(row);
            } else {
                utils.formatRow(row);
                res.rows.push(row);
            }
        });
        return res;
    });
};

utils.formatRow = function (row) {
    row.doc.id = row.doc._id;
    delete row.doc._id;
    delete row.doc._rev;
    return row;
};

module.exports = utils;
