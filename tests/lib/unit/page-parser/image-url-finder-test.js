'use strict';

const sinon = require('sinon');
const assert = require('chai').assert;
const EventEmitter = require('events');
const Page = require('../../../../lib/page');
const ImageUrlFinder = require('../../../../lib/page-parser/image-url-finder');

describe('ImageUrlFinder', function() {
    let imageUrlFinder;
    let mockSitemapBuilder;

    before(() => {
        mockSitemapBuilder = {
            addImageUrl: sinon.stub()
        };
        imageUrlFinder = new ImageUrlFinder(mockSitemapBuilder);
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
    <img src="http://facebook.com/images/foo.img" />
  </body>
</html>`;

        imageUrlFinder.register(events);

        events.emit('crwlr.visitor.post-visit', new Page(pageUrl, rawBody));

        sinon.assert.callCount(mockSitemapBuilder.addImageUrl, 1);
        assert.deepEqual(
            mockSitemapBuilder.addImageUrl.getCall(0).args,
            ['http://example.com/foo', 'http://facebook.com/images/foo.img']
        );
    });
});
