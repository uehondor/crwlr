'use strict';

const cheerio = require('cheerio');
const _ = require('lodash');

module.exports = function CssUrlFinder(sitemapBuilder) {
    var baseUrl;
    var crwlr;

    this.register = ($crwlr) => {
        baseUrl = $crwlr.getBaseUrl();
        crwlr = $crwlr;

        crwlr.on('crwlr.visitor.post-visit', findUrls);
    };

    function findUrls(page) {
        var $ = cheerio.load(page.getRawBody());

        $(`link[rel="stylesheet"][href]`).each(function() {
            var url = $(this).attr('href');
            console.log('Found css url', url);
            sitemapBuilder.addCssUrl(page.getPageUrl(), url);
        });
    }
};
