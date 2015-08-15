JMAP-Server
-----------

Implementation of a JMAP Server as specified at http://jmap.io/spec.html

### Install

```
npm install -g jmap-server
```

### Usage

First launch the server:

```
jmap-server
```

Then you can test some requests in the [examples folder](https://github.com/arnaudchenyensu/JMAP-Server/tree/master/examples):

```
curl -d "@examples/mailboxes/setMailboxes.json" -H "Content-Type: application/json" http://127.0.0.1:3000
```

If you have [jq](http://stedolan.github.io/jq/) installed:

```
curl -d "@examples/mailboxes/setMailboxes.json" -H "Content-Type: application/json" http://127.0.0.1:3000 | jq '.'
```


```
Usage: jmap-server {OPTIONS}

Standard Options:

    --port, -p Specify the port to use (default to 3000)
    --sync, -s Sync PouchDB to local CouchDB server
```

### Status

At the moment, only basic support for these methods is implemented:

* `getMailboxes`
* `getMailboxUpdates`
* `setMailboxes`
* `getThreads`
* `getMessages`
* `setMessages`

### Credits and License

Copyright (c) 2015 Arnaud Chen-yen-su, MIT License. See LICENSE.

### Contributing

* [Mailing list](https://groups.google.com/forum/#!forum/jmap-server)
* [Github Issues](https://github.com/arnaudchenyensu/JMAP-Server/issues)
