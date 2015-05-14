var config = require('../config.js');
var db     = config.db;
var _      = require('lodash');

var utils = {};

utils.getAccountId = function () {

};

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

module.exports = utils;
