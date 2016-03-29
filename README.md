# nodeapi
[nodejs](https://nodejs.org/) based API for COINS

# install

1. clone this repo
2. `cd` into the cloned folder and run `npm install`

See #usage and #environment requirements to boot the API!

# environment requirements
See [REQUIREMENTS.md](REQUIREMENTS.md) for configuring your system's environment.

# usage

```bash
$ npm run startdev # boots the API with all services available, or...
$ npm run build && node dist/index.js [flags] # build the app, then run the built copy (less CPU), or...
```

Use `node dist/index.js --help` to see all available options.
- @flag `development/release/production` run the server using COINS_ENV of the respective flag. Shorthand --dev/rel/prd are honored.

- @flag `coinstac` start the server with COINSTAC routes. Shorthand -c Defaults to false.

- @flag `without-new-relic` start the server without including the New Relic agent. Shorthand -w. Defaults to false.

## coins internal usage
To start the server as a daemon, ansible-provisioned servers should have an upstart script: `sudo start coinsnodeapi`.

To start the server with auto-restart, try using monit: `monit [re]start coinsnodeapi`.


Logs are written to the `logs/` directory in this repo.

## new relic integration
The New Relic agent is `require()`ed on startup by default, however, it does not
report to New Relic's servers by default. To turn on reporting, the environment
variable `NEW_RELIC_ENABLED` must be set to `'true'`. This should be configured
automatically on servers by Ansible: production and staging servers will enable
reporting.

When tests are run, the New Relic agent is not `require()`ed at all. This is
accomplished by overriding the cli-options in
_src/test/utils/override-cli-opts.js_.

# Design Specifications

## Code
Please refer to `CONTRIBUTING.md` for details about the code structure, and how
to add to it.

## Response format
All responses are a JSON string which parses to an object of the following format:
```js
{
  data: [ ... ],
  error: null | {},
  stats: {will eventually include performance data}
}
```
It is worth noting that the data property will always be an array, even if only a single value is requested/retrieved.

The error property will be null if no errors have occurred.
If an error did occur, then the error object will take the following form:
```js
{
  error: '...',
  message: '...',
  statusCode: ###,
  debugData: {custom debug data}
}
```

## Endpoints

### base URL
All endpoints have a prefix of `/api/v#.#.#` where `v#.#.#` is the version in
`package.json`.
The one exception to the above rule is `GET /api/version`, which can be used to
retrieve the version via the API itself.

### protocol
By default, this server starts accepting `HTTP` connections on port 8080.
To use HTTPS, place a reverse proxy server in front of this service. production
and staging environments should listen for HTTPS connections on port 443, while
development systems should listen on port 8443.

### other endpoints
Please refer to the swagger documentation that is auto-generated by this repo.
To view it, start this server `npm start`, and navigate to the base url +
`/swagger/documentation` (e.g. https://coins-api.mrn.org/swagger/documentation).

### client
This API also serves a javascript client. The client is auto-generated during the build process, and exists in _dist/client/dist/client.js_. At present the **client only runs in a nodejs environment (not in the browser)**.

To retrieve the client remotely, simply send a `get` request to `/api/client/client.js`.

The client exposes a function which takes a config object, and returns a SDK. Please refer to _src/test/utils/init-api-client.js_ for an example of setting up the client.

## Troubleshooting

If things aren't working, go down this quick checklist.

- [ ] Is a redis server installed and running locally?

- [ ] Have you pulled the latest changes in coins_auth, and run `grunt build`?

- [ ] Is nginx installed, configured and running locally?

- [ ] (only if running in COINSTAC mode) Did you create a cloudant account, or `mkdir /tmp/coinstac-pouchdb`?

If you miss any of these requirements, remove all node modules and reinstall them
after installing the requirements.

### WARNING

- tests are not passing on node 4.3.x+.  See [here](https://github.com/hapijs/hapi/issues/3103)
