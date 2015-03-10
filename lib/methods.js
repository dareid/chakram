var request = require('request'),
    _ = require('underscore'),
    Q = require('q');

var exports = module.exports = {};

var call = function (method, url, params) {
    var options = params || {};
    _.extend(options, {
        url: url,
        method: method
    });
    var deferred = Q.defer();
    request(options, function (error, response, body) {
        deferred.resolve({
            error : error,
            response: response,
            body: body
        });
    });
    return deferred.promise;
};

exports.get = function(url, params) {
    return call('GET', url, params);
};