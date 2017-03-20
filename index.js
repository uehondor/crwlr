#!/usr/bin/env node

var startUrl = process.argv[2];
if (!startUrl) {
    console.error('Please enter a valid start url to crawl e.g http://example.com');
    process.exit(1);
}

const Crwlr = require('./lib/crwlr');
const crwlr = new Crwlr(startUrl);
crwlr.crawl();
