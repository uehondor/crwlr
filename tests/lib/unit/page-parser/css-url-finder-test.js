'use strict';

const sinon = require('sinon');
const assert = require('chai').assert;
const EventEmitter = require('events');
const Page = require('../../../../lib/page');
const CssUrlFinder = require('../../../../lib/page-parser/css-url-finder.js');

describe('CssUrlFinder', function() {
    let cssUrlFinder;
    let mockSitemapBuilder;

    before(() => {
        mockSitemapBuilder = {
            addCssUrl: sinon.stub()
        };
        cssUrlFinder = new CssUrlFinder(mockSitemapBuilder);
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
    <script src="script.js"></script>
  </head>
  <body>
    <a href="/bar">Bar</a>
    <a href="http://example.com/baz">Baz</a>
    <a href="http://google.com">Google</a>
    <a href="http://facebook.com">Facebook</a>
  </body>
</html>`;

        cssUrlFinder.register(events);

        events.emit('crwlr.visitor.post-visit', new Page(pageUrl, rawBody));

        sinon.assert.callCount(mockSitemapBuilder.addCssUrl, 3);
        assert.deepEqual(
            mockSitemapBuilder.addCssUrl.getCall(0).args,
            ['http://example.com/foo', 'style.css']
        );
        assert.deepEqual(
            mockSitemapBuilder.addCssUrl.getCall(1).args,
            ['http://example.com/foo', '/style-1.css']
        );
        assert.deepEqual(
            mockSitemapBuilder.addCssUrl.getCall(2).args,
            ['http://example.com/foo', '//example.com/style-2.css']
        );
    });
});
