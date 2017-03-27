'use strict';

const cheerio = require('cheerio');
const _ = require('lodash');

module.exports = function JsUrlFinder(sitemapBuilder) {
    var baseUrl;
    var crwlr;

    this.register = ($crwlr) => {
        baseUrl = $crwlr.getBaseUrl();
        crwlr = $crwlr;

        crwlr.on('crwlr.visitor.post-visit', findUrls);
    };

    function findUrls(page) {
        var $ = cheerio.load(page.getRawBody());

        $('script[type="text/javascript"][src]').each(function() {
            var url = $(this).attr('src');
            console.log('Found js url', url);
            sitemapBuilder.addJsUrl(page.getPageUrl(), url);
        });
    }
};
