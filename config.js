var PouchDB = require('pouchdb');
PouchDB.sync('jmap', 'http://localhost:5984/jmap', {live: true});

module.exports = {
    'db': new PouchDB('jmap')
};
