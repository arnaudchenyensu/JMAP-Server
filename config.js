var PouchDB = require('pouchdb');
PouchDB.sync('jmap', 'http://localhost:5984/jmap', {live: true});
var db      = new PouchDB('jmap');

/**
 * Use a design view to filter getUpdates' requests.
 * TODO: use one DB by account
 */
var mydesign = {
    _id: "_design/mydesign",
    filters: {
        getUpdatesFilter: function (doc, req) {
            return req.query._.startsWith(doc._id, req.query.startkey);
        }.toString()
    }
};

/** Save the design doc */
db.get(mydesign._id).then(function (res) {
    mydesign._rev = res._rev;
    db.put(mydesign);
}).catch(function (err) {
    db.put(mydesign);
});

module.exports = {
    'db': db
};
