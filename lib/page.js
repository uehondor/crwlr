'use strict';

const urlParser = require('url');

module.exports = function Page(url, rawBody) {
    const pageUrl = url;

    this.getPageUrl = function() {
        return pageUrl;
    };

    this.getRawBody = function() {
        return rawBody;
    };
}
