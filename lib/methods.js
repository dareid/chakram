var request = require('request'),
    _ = require('underscore'),
    Q = require('q');

var exports = module.exports = {};

exports.request = function (method, url, params) {
    var options = params || {};
    _.extend(options, {
        url: url,
        method: method
    });
    options.jar = options.jar || request.jar();
    var deferred = Q.defer();
    request(options, function (error, response, body) {
        deferred.resolve({
            error : error,
            response: response,
            body: body,
            jar: options.jar,
            url: url
        });
    });
    return deferred.promise;
};

exports.get = function(url, params) {
    return exports.request('GET', url, params);
};

exports.post = function (url, data, params) {
    return exports.request('POST', url, _.extend({
        body: data,
        json: true
    }, params));
};