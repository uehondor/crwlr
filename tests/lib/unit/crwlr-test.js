'use strict';

let mock = require('mock-require');
let sinon = require('sinon');
let assert = require('chai').assert;

describe('Request handler', function() {
    let crwlr;
    let eventConsumer;

    before(() => {
        eventConsumer = sinon.spy();

        let Crwlr = require('../../../lib/crwlr.js');
        crwlr = new Crwlr('http://example.com');
    });

    beforeEach(() => {
        eventConsumer.reset();
    });

    after(() => {
        mock.stopAll();
    });

    it('can register plugins', function () {
        var plugin = {
            register: sinon.spy()
        };

        crwlr.use(plugin);
        crwlr.crawl();

        assert.isTrue(plugin.register.calledWithExactly(crwlr));
    });

    it('emits queue-updated event when url is queued', function () {
        var url = 'http://example.com/foo';

        crwlr.on('crwlr.queue.updated', eventConsumer);
        crwlr.queueUrl(url);

        assert.isTrue(eventConsumer.calledWithExactly(url));
    });

    it('queues url only once', function() {
        var url = 'http://example.com/bar';

        crwlr.on('crwlr.queue.updated', eventConsumer);
        crwlr.queueUrl(url);
        crwlr.queueUrl(url);

        assert.isTrue(eventConsumer.calledTwice);
        assert.isTrue(eventConsumer.calledWithExactly(url));
    });
});
