'use strict';

const mock = require('mock-require');
const sinon = require('sinon');
const assert = require('chai').assert;

describe('Crwlr', function() {
    let crwlr;
    let eventConsumer;
    let mockVisitor;
    let mockHtmlUrlFinder;
    let url = 'http://example.com';

    before(() => {
        mock('../../../lib/visitor', {
            visitedPage: sinon.stub(),
            visit: sinon.stub()
        });
        mock('../../../lib/page-parser/html-url-finder', function() {
            this.register = function() {};
        });
        mock('../../../lib/page-parser/css-url-finder', function() {
            this.register = function() {};
        });

        mockVisitor = require('../../../lib/visitor');
        mockHtmlUrlFinder = require('../../../lib/page-parser/html-url-finder');
        mockHtmlUrlFinder = require('../../../lib/page-parser/css-url-finder');

        let Crwlr = require('../../../lib/crwlr.js');
        crwlr = new Crwlr(url);
    });

    beforeEach(() => {
        eventConsumer = sinon.spy();
        mockVisitor.visitedPage.reset();
    });

    after(() => {
        mock.stopAll();
    });

    it('emits queue-updated event when url is queued', function () {
        var url = 'http://example.com/foo';

        crwlr.on('crwlr.queue.updated', eventConsumer);
        crwlr.queueUrl(url);

        assert.isTrue(eventConsumer.calledWithExactly(url));
    });

    describe('queueUrl', function() {
        it('queues url only once', function() {
            var url = 'http://example.com/bar';

            mockVisitor.visitedPage.withArgs(url).returns(false);

            crwlr.on('crwlr.queue.updated', eventConsumer);
            crwlr.queueUrl(url);
            crwlr.queueUrl(url);

            assert.isTrue(eventConsumer.calledOnce);
            assert.isTrue(eventConsumer.calledWithExactly(url));
            assert.isNull(eventConsumer.getCall(1));
        });

        it('does not queue already visited pages', function() {
            var url = 'http://example.com/baz';

            mockVisitor.visitedPage.withArgs(url)
                .onFirstCall().returns(false)
                .onSecondCall().returns(true);

            crwlr.on('crwlr.queue.updated', eventConsumer);
            crwlr.queueUrl(url);
            crwlr.queueUrl(url);

            assert.isTrue(eventConsumer.calledOnce);
            assert.isTrue(eventConsumer.calledWithExactly(url));
        });
    });

    it('publishes event when crawl is complete', function() {
        mockVisitor.visit.callsArgWith(1, null, '');
        mockVisitor.visitedPage.withArgs(url).returns(false);
        
        crwlr.on('crwlr.crawl.complete', eventConsumer);
        
        crwlr.crawl();

        assert.isTrue(eventConsumer.calledOnce);
    });

    describe('on', function() {
        it('initialises plugin with an instance of crwlr', function() {
            var plugin = {
                register: sinon.spy()
            };

            crwlr.use(plugin);
            crwlr.crawl();

            assert.isTrue(plugin.register.calledWithExactly(crwlr));
        });
    });

    describe('getBaseUrl', function() {
        it('returns base url', function() {
            let Crwlr = require('../../../lib/crwlr.js');
            var crwlr = new Crwlr('http://example.com/foo/bar/baz');
            assert.strictEqual(crwlr.getBaseUrl(), 'http://example.com');
        });
    });
});
