'use strict';

(function(factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define(factory);
  } else if (typeof module === 'object' && module.exports) {
    // CommonJS-like environments that support module.exports, like Node.
    module.exports = factory();
  }
})(function() {

    const clientFactory = require('./codegen-client/src/index.js');
    const authClient = require('./authClient');

    /**
     * Initialize the API client (singleton)
     * @param  {object} config contains properties:
     *                         apiUrl: the base URL of the remote API host
     *                         xhrAgent: the XHR Agent to be used: (axios)
     *                         store: a persistent data store for auth keys.
     *                             should implement a sync localstorage interface.
     * @return {object} apiClient object
     */
    return (config) => {
        // create a new instance of the agent because authClient adds an
        // interceptor, and we do not want to modify the global agent.
        config.xhrAgent = config.xhrAgent.create();
        const client = clientFactory(config);

        // intialize the authClient, which wraps the auth methods of the apiClient
        client.auth = authClient.init(client, config);
        return client;
    };
});
