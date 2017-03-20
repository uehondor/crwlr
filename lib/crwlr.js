'use strict';

const urlParser = require('url');
const EventEmitter = require('events');
const visitor = require('./visitor');

function Crwlr(startUrl) {
    const queue = [];
    const events = new EventEmitter();
    const parsedUrl = urlParser.parse(startUrl);
    const baseUrl = `${parsedUrl.protocol}//${parsedUrl.hostname}`;
    const eventsMap = {
        'queue-updated': 'crwlr.queue.updated',
        'page-visited': 'crwlr.visitor.post-visit',
        'finish': 'crwlr.crawl.complete'
    };

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
    };

    this.queueUrl(startUrl);
};

module.exports = Crwlr;
