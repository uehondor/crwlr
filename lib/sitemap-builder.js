'use strict';

function SitemapBuilder() {
    const sitemap = {};

    this.addPageUrl = function(parentUrl, url) {
        addPage(parentUrl);
        addUrl('urls', parentUrl, url);
    };

    this.addImageUrl = function(parentUrl, url) {
        addPage(parentUrl);
        addUrl('images', parentUrl, url);
    };

    this.addCssUrl = function(parentUrl, url) {
        addPage(parentUrl);
        addUrl('css', parentUrl, url);
    };

    this.addJsUrl = function(parentUrl, url) {
        addPage(parentUrl);
        addUrl('js', parentUrl, url);
    };

    this.get = function() {
        return sitemap;
    }

    function addUrl(key, parentUrl, url) {
        if (sitemap[parentUrl][key].indexOf(url) == -1) {
            sitemap[parentUrl][key].push(url);
        }
    }

    function addPage(parentUrl) {
        if (!(parentUrl in sitemap)) {
            sitemap[parentUrl] = {
                urls: [],
                images: [],
                css: [],
                js: []
            };
        }
    }
};

module.exports = SitemapBuilder;
