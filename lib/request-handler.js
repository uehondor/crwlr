'use strict';
const Promise = require('promise');
const request = require('request');

const get = (url, callback) => {
    request.get(url, {gzip: true}, (error, response, body) => {
        if (error) {
            return callback(error);
        }

        if (!/2\d{2}/.test(response.statusCode)) {
            return callback('Unexpected Response');
        }

        callback(null, body);
    });
};

module.exports = {
    get
};
