# crwlr
Crwlr is a simple event-driven, 'plugin-able' web crawler.

## Architecture
The architecture is simple, event-driven, to decouple the following components:
* HtmlUrlFinder - module responsible for traversing the DOM to find urls, and adding 'allowed' urls to the 'visit-url' queue
* ImageUrlFinder, CssUrlFinder and JsUrlFinder - find statics
* Visitor - module is responsible for visiting urls popped from the front of the 'visit-url' queue and ensuring urls are not visited more than once.
* SitemapManager - builds an in-memory map of website as the crawling operation takes place. The HtmlUrlFinder, ImageUrlFinder, CssUrlFinder and JsUrlFinder plugins are instantiated with the SitemapManager and are responsible for updating the map.

## Events
For now, Crwlr emits the events found in `./lib/event-map.js`


## How to run it
Install Nodejs dependencies
```
$ npm install
```

From the project's root directory, execute the following command:
```
$ npm start -- http://example.com
```

When crawling is complete, a map of the website is dumped in JSON format to `./sitemap.json`.

## Todo
* Rate limit requests to `n per time`
    * Provide options to control the limit
* Visit pages in parallel, up to a maximum configurable n requests
    * To reduce time to crawl websites, crwlr should be able to visit pages in parallel, as they're being queued
    * However, the problem at the moment is knowing when all pages have been visited. This is important because the site map generation logic relies on the 'complete' event
* Deal with hashtags
    * the crawler uses the page url to determine whether to the page has previously been visited.
    * however, urls with hashtags will usually be visited more than once