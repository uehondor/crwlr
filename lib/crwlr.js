'use strict';

const urlParser = require('url');
const EventEmitter = require('events');

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
        // visit page
        console.log('Visit', pageUrl);
    };

    var crawlComplete = () => {
        console.log('Crawl complete');
    };

    this.queueUrl(startUrl);
};

module.exports = Crwlr;
