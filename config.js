var PouchDB = require('pouchdb');
PouchDB.replicate('jmap', 'http://localhost:5984/jmap', {live: true});

module.exports = {
    'db': new PouchDB('jmap')
};
