var request = require('request'),
    extend = require('extend-object'),
    Q = require('q'),
    generator = require('./generator/generator.js');

var exports = module.exports = {};

/**
Perform HTTP request
@param {string} method - the HTTP method to use
@param {string} url - fully qualified url
@param {Object} [params] - additional request options, see the popular {@link https://github.com/request/request#requestoptions-callback request library} for options
@returns {Promise} Promise which will resolve to a {@link ChakramResponse} object
@alias module:chakram.request
@example 
var request = chakram.request("GET", "http://httpbin.org/get", {
    'auth': {'user': 'username','pass': 'password'}
});
expect(request).to.have.status(200);
 */
exports.request = function (method, url, params) {
    var options = extend({
        url: url,
        method: method,
        json: true,
        jar: request.jar()
    }, params || {} );
    var deferred = Q.defer();
    request(options, function (error, response, body) {
/**
Chakram Response Object
@desc Encapsulates the results of a HTTP call into a single object
@typedef {Object} ChakramResponse
@property {Error} error - An error when applicable
@property {Object} response - An {@link http://nodejs.org/api/http.html#http_http_incomingmessage http.IncomingMessage} object
@property {String|Buffer|Object} body - The response body. Typically a JSON object unless the json option has been set to false, in which case will be either a String or Buffer
@property {Object} jar - A {@link https://github.com/goinstant/tough-cookie tough cookie} jar
@property {String} url - The request's original URL
 */
        var respObj = {
            error : error,
            response: response,
            body: body,
            jar: options.jar,
            url: url
        };
        generator.record(respObj);
        deferred.resolve(respObj);
    });
    return deferred.promise;
};

/**
Perform HTTP GET request
@param {string} url - fully qualified url
@param {Object} [params] - additional request options, see the popular {@link https://github.com/request/request#requestoptions-callback request library} for options
@returns {Promise} Promise which will resolve to a {@link ChakramResponse} object
@alias module:chakram.get
 */
exports.get = function(url, params) {
    return exports.request('GET', url, params);
};

/**
Perform HTTP HEAD request
@param {string} url - fully qualified url
@param {Object} [params] - additional request options, see the popular {@link https://github.com/request/request#requestoptions-callback request library} for options
@returns {Promise} Promise which will resolve to a {@link ChakramResponse} object
@alias module:chakram.head
 */
exports.head = function(url, params) {
    return exports.request('HEAD', url, params);
};

/**
Perform HTTP OPTIONS request
@param {string} url - fully qualified url
@param {Object} [params] - additional request options, see the popular {@link https://github.com/request/request#requestoptions-callback request library} for options
@returns {Promise} Promise which will resolve to a {@link ChakramResponse} object
@alias module:chakram.options
 */
exports.options = function(url, params) {
    return exports.request('OPTIONS', url, params);
};

var extendWithData = function (data, params) {
    return extend({body: data}, params);
};


/**
Perform HTTP POST request
@param {string} url - fully qualified url
@param {Object} data - a JSON serializable object (unless json is set to false in params, in which case this should be a buffer or string)
@param {Object} [params] - additional request options, see the popular {@link https://github.com/request/request#requestoptions-callback request library} for options
@returns {Promise} Promise which will resolve to a {@link ChakramResponse} object
@alias module:chakram.post
 */
exports.post = function (url, data, params) {
    return exports.request('POST', url, extendWithData(data, params));
};

/**
Perform HTTP PATCH request
@param {string} url - fully qualified url
@param {Object} data - a JSON serializable object (unless json is set to false in params, in which case this should be a buffer or string)
@param {Object} [params] - additional request options, see the popular {@link https://github.com/request/request#requestoptions-callback request library} for options
@returns {Promise} Promise which will resolve to a {@link ChakramResponse} object
@alias module:chakram.patch
 */
exports.patch = function (url, data, params) {
    return exports.request('PATCH', url, extendWithData(data, params));
};


/**
Perform HTTP PUT request
@param {string} url - fully qualified url
@param {Object} data - a JSON serializable object (unless json is set to false in params, in which case this should be a buffer or string)
@param {Object} [params] - additional request options, see the popular {@link https://github.com/request/request#requestoptions-callback request library} for options
@returns {Promise} Promise which will resolve to a {@link ChakramResponse} object
@alias module:chakram.put
 */
exports.put = function (url, data, params) {
    return exports.request('PUT', url, extendWithData(data, params));
};

/**
Perform HTTP DELETE request
@param {string} url - fully qualified url
@param {Object} [data] - a JSON serializable object (unless json is set to false in params, in which case this should be a buffer or string)
@param {Object} [params] - additional request options, see the popular {@link https://github.com/request/request#requestoptions-callback request library} for options
@returns {Promise} Promise which will resolve to a {@link ChakramResponse} object
@alias module:chakram.delete
 */
exports.delete = function(url, data, params) {
    return exports.request('DELETE', url, extendWithData(data, params));
};