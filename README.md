# nodeapi
node based API for COINS

# Design Specifications
## Response format
All responses are a JSON string which parses to an object of the following format:
```js
{
  data: [ ... ],
  error: null | {}
}
```
It is worth noting that the data property will always be an array, even if only a single value is requested/retrieved.

The error property will be null if no errors have occurred.
If an error did occur, then the error object will take the following form:
```js
{
  error: '...',
  message: '...',
  statusCode: ###
}
```

## Endpoints

### /auth

TODO: consider refactoring to be more RESTful. (e.g. login with POST to `/auth/keys`, logout with DELETE to `/auth/keys/<public key>`)

* **[GET] /auth/login** Get a new API key. This route expects that an
`Authorization` header be set in the request. See `test/integration/login.js`
for an example of how to create the header's value. The response will also
contain a `set-cookie` header with a backwards-compatible JWT as its value.
This route should only be accessed via `https` as it receives and responds with
protected information.

* **[GET] /auth/cookies/<cookie-value>** Verify a cookie's value and get an
updated cookie with a new expiration timestamp. There are several expected
errors which can occur. In all cases, the best path forward is to ask the user
to login again. **Note that this route is strictly for use by the COINS2.0 system, and should not be used by any COINS3.0 code**
  * **Invalid cookie value:** response code 400.
  * **Expired cookie:** response code 401.
  * **No API key found:** response code 401.

**All routes below require a HAWK authentication header to be sent with the
request. See the integration tests (`/test/integration`) for examples.**

* **[GET] /auth/logout/<api-key>** Remove the API key from the server's
database. This route is secured by HAWK, and you must pass authentication headers to access it. In addition, your authentication header must match the `api-key` that you are attempting to logout. There are three possible responses:
  * **404** indicates that the key does not exist on the server.
  * **401** indicates that you failed to authenticate, or that the `api-key` and your HAWK signature do not match.
  * **200** indicates that the API key was successfully removed. In addition, a `set-cookie` header will be included with the response to invalidate the JWT cookie.
