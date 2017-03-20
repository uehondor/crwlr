'use strict';

const request = require('request');
const Page = require('./page');

module.exports = new function Visitor() {
    var visited = [];

    this.visit = function(url, callback) {
        if (this.notVisitedPage(url)) {
            console.log('Visiting', url);
            return visitPage(url, callback);
        }

        console.log('Already visited', url);
        return callback('Already visited');
    };

    this.notVisitedPage = function(url) {
        return !this.visitedPage(url);
    };

    this.visitedPage = function(url) {
        return visited.indexOf(url) > -1
    }

    function visitPage(url, callback) {
        request.get(url, {gzip: true}, (error, response, body) => {
            if (error) {
                return callback(error);
            }

            visited.push(url);

            if (!/2\d{2}/.test(response.statusCode)) {
                return callback('Unexpected Response');
            }

            callback(null, new Page(url, body));
        });
    }
};
