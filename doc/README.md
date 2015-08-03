# utils.js API documentation

<!-- div class="toc-container" -->

<!-- div -->

## `utils`
* <a href="#utils-assert">`utils.assert`</a>
* <a href="#utils-check">`utils.check`</a>
* <a href="#utils-create">`utils.create`</a>
* <a href="#utils-destroy">`utils.destroy`</a>
* <a href="#utils-executeMethod">`utils.executeMethod`</a>
* <a href="#utils-formatRow">`utils.formatRow`</a>
* <a href="#utils-get">`utils.get`</a>
* <a href="#utils-getUpdates">`utils.getUpdates`</a>
* <a href="#utils-isCorrectType">`utils.isCorrectType`</a>
* <a href="#utils-set">`utils.set`</a>
* <a href="#utils-update">`utils.update`</a>

<!-- /div -->

<!-- /div -->

<!-- div class="doc-container" -->

<!-- div -->

## `utils`

<!-- div -->

### <a id="utils-assert"></a>`utils.assert(val, type)`
<a href="#utils-assert">#</a> [&#x24C8;](https://github.com/arnaudchenyensu/JMAP-Server/blob/master/utils.js#L17 "View in source") [&#x24C9;][1]

Use for checking type. Basic wrapper for some lodash method (_.isString, _.isNumber, ...).

#### Arguments
1. `val` *(&#42;)*: The value to test.
2. `type` *(string)*: The type to assert.

#### Returns
*(Boolean)*:       Returns true if val is of the defined type.

* * *

<!-- /div -->

<!-- div -->

### <a id="utils-check"></a>`utils.check(propertiesModel, properties, checks)`
<a href="#utils-check">#</a> [&#x24C8;](https://github.com/arnaudchenyensu/JMAP-Server/blob/master/utils.js#L211 "View in source") [&#x24C9;][1]

Iterate over propertiesModel and invoke each check in checks.
Stop check iteration for a property as soon as a check does not pass.
Current possible checks are:<br>
<br>
* `immutable`
<br>
* `serverSetOnly`
<br>
* `defaultValue`: set default value if `value === undefined`
<br>
* `checkTypes`
<br>
* any string that correspond to a property of `propertiesModel`

#### Arguments
1. `propertiesModel` *(Object)*: Properties' model to iterate over.
2. `properties` *(Object)*: The properties to check.
3. `checks` *(string&#91;&#93;)*: Each check to invoke.

#### Returns
*(Object)*:                    `{error: true/false, description: "", properties: []}`.

#### Example
```js
utils.check(models.mailbox, properties, ["serverSetOnly", "checkTypes", "checksWhenCreate"]);
// => return {error: true, description: "id is serverSetOnly", properties: ["id"]}
```
* * *

<!-- /div -->

<!-- div -->

### <a id="utils-create"></a>`utils.create(result, creationId, obj, model)`
<a href="#utils-create">#</a> [&#x24C8;](https://github.com/arnaudchenyensu/JMAP-Server/blob/master/utils.js#L277 "View in source") [&#x24C9;][1]

Create `obj` in database.

#### Arguments
1. `result` *(Object)*: Result object from `utils.set`.
2. `creationId` *(string)*: The creationId given at the request.
3. `obj` *(Object)*: The object to create.
4. `model` *(Object)*: The model used to validate `obj`.

#### Returns
*(Promise)*:             Promise which resolves with `setError` or
the object created.

* * *

<!-- /div -->

<!-- div -->

### <a id="utils-destroy"></a>`utils.destroy(result, objId)`
<a href="#utils-destroy">#</a> [&#x24C8;](https://github.com/arnaudchenyensu/JMAP-Server/blob/master/utils.js#L366 "View in source") [&#x24C9;][1]

Destroy a doc.

#### Arguments
1. `result` *(Object)*: Result object from utils.set.
2. `objId` *(string)*: Id of the object in database.

* * *

<!-- /div -->

<!-- div -->

### <a id="utils-executeMethod"></a>`utils.executeMethod(method, req, callId)`
<a href="#utils-executeMethod">#</a> [&#x24C8;](https://github.com/arnaudchenyensu/JMAP-Server/blob/master/utils.js#L60 "View in source") [&#x24C9;][1]

Execute `method`.

#### Arguments
1. `method` *(Object)*: Method like `mailbox.methods.getMailboxes`.
2. `req` *(Object)*: The request send, e.g `{accountId: "", ids: [], ...}`.
3. `callId` *(string)*: The callId send.

#### Returns
*(Promise)*:         Promise which resolve with &#91;responseName, response, callId&#93;.

* * *

<!-- /div -->

<!-- div -->

### <a id="utils-formatRow"></a>`utils.formatRow(row)`
<a href="#utils-formatRow">#</a> [&#x24C8;](https://github.com/arnaudchenyensu/JMAP-Server/blob/master/utils.js#L437 "View in source") [&#x24C9;][1]

Replace `row.doc._id` by `row.doc.id` and delete `row.doc._rev`.

#### Arguments
1. `row` *(Object)*: A row as PouchDB will return for a get request.

#### Example
```js
var row = {
    doc: {
        _id: "myId",
        _rev: "myRev",
        ...
    }
};

formatRow(row);
// => {doc: {id: "myId", ...}}
```
* * *

<!-- /div -->

<!-- div -->

### <a id="utils-get"></a>`utils.get(opts)`
<a href="#utils-get">#</a> [&#x24C8;](https://github.com/arnaudchenyensu/JMAP-Server/blob/master/utils.js#L121 "View in source") [&#x24C9;][1]

Execute a get request in the database.

#### Arguments
1. `opts` *(Object)*: Options for the request. By default `opts.include_docs = true`.

#### Returns
*(Promise)*:      Promise which resolves with {errors: , deleted: , rows: }.

* * *

<!-- /div -->

<!-- div -->

### <a id="utils-getUpdates"></a>`utils.getUpdates(opts)`
<a href="#utils-getUpdates">#</a> [&#x24C8;](https://github.com/arnaudchenyensu/JMAP-Server/blob/master/utils.js#L406 "View in source") [&#x24C9;][1]

Get updates for a ressource.

#### Arguments
1. `opts` *(Object)*: Options for the request -- `sinceState`, `startkey`

#### Example
```js
{ results:
    [ { id: 'examples@examples.com_mailbox_test',
        changes: [Object],
         deleted: true,
        seq: 4723 },
      { id: 'examples@examples.com_mailbox_954bd560-0e6c-11e5-b8af-d507cf2ec24b',
        changes: [Object],
        deleted: true,
        seq: 5043 },
        ...
     ]
}
```
* * *

<!-- /div -->

<!-- div -->

### <a id="utils-isCorrectType"></a>`utils.isCorrectType(val, types)`
<a href="#utils-isCorrectType">#</a> [&#x24C8;](https://github.com/arnaudchenyensu/JMAP-Server/blob/master/utils.js#L44 "View in source") [&#x24C9;][1]

Check that `val` is one of the type in `types`.

#### Arguments
1. `val` *(&#42;)*: Value to check.
2. `types` *(string&#91;&#93;)*: Array of string types *("string", "boolean", ...)*.

#### Returns
*(Boolean)*:          Return true if `val` is one of the type.

* * *

<!-- /div -->

<!-- div -->

### <a id="utils-set"></a>`utils.set(opts)`
<a href="#utils-set">#</a> [&#x24C8;](https://github.com/arnaudchenyensu/JMAP-Server/blob/master/utils.js#L153 "View in source") [&#x24C9;][1]

Execute a set request in the database.

#### Arguments
1. `opts` *(Object)*: Options for the request -- `opts.accountId`, `opts.model`, `opts.create`, `opts.update`, `opts.destroy`.

#### Returns
*(Promise)*:       Promise which resolves with `res.accountId`, `res.notCreated`, `res.created`,
`res.notUpdated`, `res.updated`, `res.notDestroyed`, `res.destroyed`.

* * *

<!-- /div -->

<!-- div -->

### <a id="utils-update"></a>`utils.update(result, objId, updatedProperties, model)`
<a href="#utils-update">#</a> [&#x24C8;](https://github.com/arnaudchenyensu/JMAP-Server/blob/master/utils.js#L319 "View in source") [&#x24C9;][1]

Update an object in database.

#### Arguments
1. `result` *(Object)*: Result object from utils.set.
2. `objId` *(string)*: Id of the object in database.
3. `updatedProperties` *(Object)*: The properties to update.
4. `model` *(Object)*: The model used to validate `updatedProperties`.

#### Returns
*(Promise)*:                    Promise which resolves with `setError` or `objId`.

* * *

<!-- /div -->

<!-- /div -->

<!-- /div -->

 [1]: #utils "Jump back to the TOC."
