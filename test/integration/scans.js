'use strict';

const chai = require('chai');
const server = require('../../');
const _ = require('lodash');
const Bluebird = require('bluebird');
const initApiClient = require('../utils/init-api-client.js');
let apiClient;

/**
 * set the apiClient variable inside the parent closure
 * @param  {object} client an initialized API Client
 * @return {object}        the same API Client
 */
const setApiClient = function(client) {
    apiClient = client;
    return client;
};

// Set should property of all objects for BDD assertions
const should = chai.should();

describe('Scan routes', () => {
    before('wait for server to be ready', () => {
        return server.app.pluginsRegistered
            .then(initApiClient)
            .then(setApiClient)
            .then(function addScanPrivsToTestUser() {
                return new Bluebird((res, rej) => {
                    server.plugins.relations.study(
                        'mochatest is PI of 2319',
                        (err) => {
                            if (err) {
                                rej(err);
                            } else {
                                res();
                            }
                        }

                    );
                });
            });
    });

    describe('GET /scans', () => {
        let responsePromise;
        before(() => {
            responsePromise = apiClient.auth.login('mochatest', 'mocha');
            return responsePromise;
        });

        it('Should return all scans', () => {
            return responsePromise
                .then(_.noop)
                .then(apiClient.scans.get)
                .then((response) => {
                    response.result.data.should.have.length.of.at.least(9);
                    response.result.data[0].should.have.property('scan_id');
                    should.equal(response.result.error, null);
                });
        });

        it('Should return scans by ursi', () => {
            return responsePromise
                .then(_.noop)
                .then(_.partial(apiClient.scans.get, {ursi: 'M06123761'}))
                .then((response) => {
                    response.result.data.should.have.length.of.at.least(7);
                    response.result.data[0].should.have.property('scan_id');
                    should.equal(response.result.error, null);
                });
        });

        it('Should return scans by study', () => {
            return responsePromise
                .then(_.noop)
                .then(_.partial(apiClient.scans.get, {studyId: 2319}))
                .then((response) => {
                    response.result.data.should.have.length.of.at.least(9);
                    response.result.data[0].should.have.property('scan_id');
                    should.equal(response.result.error, null);
                });
        });
    });
});
