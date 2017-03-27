'use strict';

const sinon = require('sinon');
const assert = require('chai').assert;
const EventEmitter = require('events');
const Page = require('../../../../lib/page');
const JsUrlFinder = require('../../../../lib/page-parser/javascript-url-finder');

describe('JsUrlFinder', function() {
    let jsUrlFinder;
    let mockSitemapBuilder;

    before(() => {
        mockSitemapBuilder = {
            addJsUrl: sinon.stub()
        };
        jsUrlFinder = new JsUrlFinder(mockSitemapBuilder);
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
    <link rel="stylesheet" href="/style-1.css">
    <link rel="stylesheet" href="//example.com/style-2.css">
    <script type="text/javascript" src="script.js"></script>
    <script type="text/javascript" src="http://example.com/script1.js"></script>
    <script type="text/javascript" src="http://statics.cdn.com/script2.js"></script>
  </head>
  <body>
    <a href="/bar">Bar</a>
    <a href="http://example.com/baz">Baz</a>
    <a href="http://google.com">Google</a>
    <a href="http://facebook.com">Facebook</a>
  </body>
</html>`;

        jsUrlFinder.register(events);

        events.emit('crwlr.visitor.post-visit', new Page(pageUrl, rawBody));

        sinon.assert.callCount(mockSitemapBuilder.addJsUrl, 3);
        assert.deepEqual(
            mockSitemapBuilder.addJsUrl.getCall(0).args,
            ['http://example.com/foo', 'script.js']
        );
        assert.deepEqual(
            mockSitemapBuilder.addJsUrl.getCall(1).args,
            ['http://example.com/foo', 'http://example.com/script1.js']
        );
        assert.deepEqual(
            mockSitemapBuilder.addJsUrl.getCall(2).args,
            ['http://example.com/foo', 'http://statics.cdn.com/script2.js']
        );
    });
});
