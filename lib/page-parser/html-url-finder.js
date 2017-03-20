'use strict';

const cheerio = require('cheerio');
const _ = require('lodash');

module.exports = function HtmlUrlFinder(sitemapBuilder) {
    var baseUrl;
    var crwlr;

    this.register = ($crwlr) => {
        baseUrl = $crwlr.getBaseUrl();
        crwlr = $crwlr;

        crwlr.on('crwlr.visitor.post-visit', findUrls);
    };

    function findUrls(page) {
        var $ = cheerio.load(page.getRawBody());
        var anchorElements = $(`a[href]`);

        console.log('Found %d urls in %s', anchorElements.length, page.getPageUrl());

        anchorElements.each(function() {
            var childUrl = $(this).attr('href');

            if (!isAllowedUrl(childUrl)) {
                return;
            }

            var canonisedUrl = canoniseUrl(childUrl);
            
            crwlr.queueUrl(canonisedUrl);
            sitemapBuilder.addPageUrl(page.getPageUrl(), canonisedUrl);
        });
    }

    function canoniseUrl(url) {
        // rebuild urls like ../../../../path/to/page.html to path/to/page.html
        // and prepend baseUrl if url is relative
        if (!url.match(`^${baseUrl}`)) {
            url = _.trimStart(url, '/');
            url = baseUrl + '/' + url.replace(/(\.\.\/)+/, '');
        }

        return _.trimEnd(url, '/');
    }

    function isAllowedUrl(url) {
        if (url.match(`^${baseUrl}`)) {
            return true;
        }

        return url.match(/^[^http]/) !== null
            && url.match(/^\/\//) === null;
    }
};
