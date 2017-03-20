#!/usr/bin/env node

var startUrl = process.argv[2];
if (!startUrl) {
    console.error('Please enter a valid start url to crawl e.g http://example.com');
    process.exit(1);
}

const Crwlr = require('./lib/crwlr');
const crwlr = new Crwlr(startUrl);
const fs = require('fs');

crwlr.on('crwlr.crawl.complete', function(sitemap) {
    var fileName = __dirname + '/sitemap.json';
    console.log('Writing site map to', fileName);
    fs.writeFileSync(fileName, JSON.stringify(sitemap, null, "\t"));
});
crwlr.crawl();
