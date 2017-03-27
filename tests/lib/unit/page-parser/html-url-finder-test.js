'use strict';

const sinon = require('sinon');
const assert = require('chai').assert;
const EventEmitter = require('events');
const Page = require('../../../../lib/page');

describe('HtmlUrlFinder', function() {
    let htmlUrlFinder;
    let mockSitemapBuilder;

    before(() => {
        mockSitemapBuilder = {
            addPageUrl: sinon.stub()
        };

        let HtmlUrlFinder = require('../../../../lib/page-parser/html-url-finder.js');
        htmlUrlFinder = new HtmlUrlFinder(mockSitemapBuilder);
    });

    it('extracts urls from html document', function () {
        EventEmitter.prototype.getBaseUrl = function() {
            return 'http://example.com';
        };

        EventEmitter.prototype.queueUrl = function() {};

        var events = new EventEmitter();
        var pageUrl = 'http://example.com/foo';
        var rawBody = `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <title>title</title>
    <link rel="stylesheet" href="style.css">
    <script src="script.js"></script>
  </head>
  <body>
    <a href="/bar">Bar</a>
    <a href="http://example.com/baz">Baz</a>
    <a href="http://google.com">Google</a>
    <a href="http://facebook.com">Facebook</a>
  </body>
</html>`;

        htmlUrlFinder.register(events);

        events.emit('crwlr.visitor.post-visit', new Page(pageUrl, rawBody));

        sinon.assert.callCount(mockSitemapBuilder.addPageUrl, 2);
        assert.deepEqual(
            mockSitemapBuilder.addPageUrl.getCall(0).args,
            ['http://example.com/foo', 'http://example.com/bar']
        );
        assert.deepEqual(
            mockSitemapBuilder.addPageUrl.getCall(1).args,
            ['http://example.com/foo', 'http://example.com/baz']
        );
    });
});
