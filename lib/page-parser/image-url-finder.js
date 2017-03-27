'use strict';

const cheerio = require('cheerio');
const _ = require('lodash');

module.exports = function ImageUrlFinder(sitemapBuilder) {
    var baseUrl;
    var crwlr;

    this.register = ($crwlr) => {
        baseUrl = $crwlr.getBaseUrl();
        crwlr = $crwlr;

        crwlr.on('crwlr.visitor.post-visit', findImageUrls);
    };

    function findImageUrls(page) {
        var $ = cheerio.load(page.getRawBody());

        $(`*[style^='background']`).each(function() {
            var imageSrc = $(this).attr('style').replace(/.*\s?url\([\'\"]?/, '').replace(/[\'\"]?\).*/, '');
            console.log('Found image url', imageSrc);
            sitemapBuilder.addImageUrl(page.getPageUrl(), imageSrc);
        });

        $(`img[src]`).each(function() {
            var imageSrc = $(this).attr('src');
            console.log('Found image url', imageSrc);
            sitemapBuilder.addImageUrl(page.getPageUrl(), imageSrc);
        });
    }
};
