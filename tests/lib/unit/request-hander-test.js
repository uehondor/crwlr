'use strict';

let mock = require('mock-require');
let sinon = require('sinon');
let assert = require('chai').assert;

describe('Request handler', function() {
    let requestHandler;
    let mockRequest;

    before(() => {
        mock('request', { get: sinon.stub() });
        mockRequest = require('request');

        requestHandler = require('../../../lib/request-handler.js');
    });

    beforeEach(() => {
        mockRequest.get.reset();
    });

    after(() => {
        mock.stopAll();
    });

    it('returns a body when a 2xx response is given', function () {
        let response = {
            statusCode: 200
        };
        let responseBody = 'body';
        let callback = sinon.spy();

        mockRequest.get.callsArgWith(2, null, response, responseBody);

        requestHandler.get('http://example.com', callback);

        assert.isTrue(callback.calledWithExactly(null, responseBody))
    });

    it('does not return a body when a non-2xx response is given', function () {
        let response = {
            statusCode: 404
        };
        let responseBody = 'body';
        let callback = sinon.spy();

        mockRequest.get.callsArgWith(2, null, response, responseBody);

        requestHandler.get('http://example.com', callback);

        assert.isTrue(callback.calledWithExactly('Unexpected Response'));
    });

    it('does not return a body when an error is returned', function () {
        let error = 'Error making request';
        let response = {
            statusCode: 200
        };
        let responseBody = 'body';
        let callback = sinon.spy();

        mockRequest.get.callsArgWith(2, error, response, responseBody);

        requestHandler.get('http://example.com', callback);

        assert.isTrue(callback.calledWithExactly(error));
    });
});
