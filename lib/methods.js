var request = require('request'),
    _ = require('underscore'),
    Q = require('q');

var exports = module.exports = {};

exports.request = function (method, url, params) {
    var options = _.extend({
        url: url,
        method: method,
        json: true,
        jar: request.jar()
    }, params || {} );
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

exports.head = function(url, params) {
    return exports.request('HEAD', url, params);
};

exports.options = function(url, params) {
    return exports.request('OPTIONS', url, params);
};

var extendWithData = function (data, params) {
    return _.extend({body: data}, params);
};

exports.post = function (url, data, params) {
    return exports.request('POST', url, extendWithData(data, params));
};

exports.patch = function (url, data, params) {
    return exports.request('PATCH', url, extendWithData(data, params));
};

exports.put = function (url, data, params) {
    return exports.request('PUT', url, extendWithData(data, params));
};

exports.delete = function(url, data, params) {
    return exports.request('DELETE', url, extendWithData(data, params));
};