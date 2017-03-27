'use strict';

const urlParser = require('url');
const EventEmitter = require('events');
const visitor = require('./visitor');
const SitemapBuilder = require('./sitemap-builder');

// internal plugins
const HtmlUrlFinder = require('./page-parser/html-url-finder');
const CssUrlFinder = require('./page-parser/css-url-finder');
const ImageUrlFinder = require('./page-parser/image-url-finder');
const JsUrlFinder = require('./page-parser/javascript-url-finder');

function Crwlr(startUrl) {
    const queue = [];
    const events = new EventEmitter();
    const sitemapBuilder = new SitemapBuilder;
    const parsedUrl = urlParser.parse(startUrl);
    const baseUrl = `${parsedUrl.protocol}//${parsedUrl.hostname}`;
    const eventsMap = require('./event-map');

    this.on = function(eventName, callback) {
        console.log('Subscribing to event', eventName);
        events.on(eventName, callback);
    }

    this.crawl = () => {
        var pageUrl = queue.pop();
        console.log('Current size of queue', queue.length);
        
        if (pageUrl === undefined) {
            crawlComplete();
            return;
        }
        
        visit(pageUrl);
    }

    this.use = function(plugin) {
        console.log('Registering plugin');
        plugin.register(this);
    };

    this.queueUrl = function(url) {
         // check page is not already visited
        if (visitor.visitedPage(url)) {
            console.log('Url already visited:', url);
            return;
        }

        // check url is not already queued
        if (queue.indexOf(url) > -1) {
            console.log('Url already queued:', url);
            return;
        }

        if (queue.push(url)) {
            events.emit(eventsMap['queue-updated'], url);
        }
    };

    this.getBaseUrl = function() {
        return baseUrl;
    };

    var visit = (pageUrl) => {
       visitor.visit(pageUrl, (error, page) => {
            if (!error) {
                console.log('page', pageUrl, 'visited');
                events.emit(eventsMap['page-visited'], page);
            }

            this.crawl();
        });
    };

    var crawlComplete = () => {
        console.log('Crawl complete');
        events.emit(eventsMap['finish'], sitemapBuilder.get());
    };

    // register internal plugins
    this.use(new HtmlUrlFinder(sitemapBuilder));
    this.use(new CssUrlFinder(sitemapBuilder));
    this.use(new ImageUrlFinder(sitemapBuilder));
    this.use(new JsUrlFinder(sitemapBuilder));

    this.queueUrl(startUrl);
};

module.exports = Crwlr;
