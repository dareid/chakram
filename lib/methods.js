const { merge, mapKeys } = require("lodash");
const tough = require("tough-cookie");
const Q = require("q");
const { getFetch } = require("./fetch");

const globalRequestJar = new tough.CookieJar();

let defaultsJar;
let defaultedRequestParams = {};

/**
 * merges http headers
 * @private
 * @param   {object}  headers  user specified headers
 * @param   {boolean}  asJson   if true default content-type application/json is added
 *
 * @return  {object}           the merged headers
 */
const mergeHeaders = (headers, asJson) => {
    const jsonContentTypeHeader = { "content-type": "application/json" };

    return mapKeys(merge({}, asJson ? jsonContentTypeHeader : {}, headers), function (_value, key) {
        return key.toLowerCase();
    });
};

/**
 * calculates response time of request based on HRTimer
 * @private
 *
 * @param   {HRTimer}  timer      the current timer
 *
 * @return  {object}             object containing responseTime in ms
 */
const getResponseTime = (timer) => {
    const elapsedTime = process.hrtime(timer);
    const elapsedMilliseconds = elapsedTime[0] * 1000 + elapsedTime[1] / 1000000;

    return { responseTime: elapsedMilliseconds };
};

/**
 * parses response body based on content type and json flag
 * @private
 *
 * @param   {object}  response  the Node Fetch response
 * @param   {boolean}  json      boolean flag to indicate response should be processed as json
 *
 * @return  {any}            the parsed body
 */
const parseBody = async (response, json) => {
    let parsedBody;

    // parse to json if content-type of response has matching content-type and json flag is true
    const contentType = response.headers.get("content-type");

    if (!contentType) {
        return;
    }

    const shouldParseBodyAsJson = contentType.includes("application/json") && json;

    try {
        if (shouldParseBodyAsJson) {
            parsedBody = await response.json();
        } else {
            parsedBody = await response.text();
        }

        return parsedBody;
    } catch (error) {
        return error;
    }
};

/**
 * format the response
 * @private
 *
 * @param   {string}  url        the url for the request
 * @param   {object}  options    the fetch options
 * @param   {boolean}  json       boolean flag to indicate response should be processed as json
 * @param   {object}  response   the fetch response
 * @param   {HRTimer}  timer      the current timer
 * @param   {object}  cookieJar  tough cookie jar
 *
 * @return  {object}             the formatted response
 */
const formatResponse = async (url, options, json, response, timer, cookieJar) => {
    try {
        const method = options.method;
        const parsedBody = method === "HEAD" ? undefined : await parseBody(response, json);

        return {
            response,
            error: null,
            jar: cookieJar,
            url,
            body: parsedBody,
            ...getResponseTime(timer),
        };
    } catch (error) {
        return error;
    }
};

/**
 * formats the error response
 * @private
 *
 * @param   {string}  url        the url for the request
 * @param   {object}  error      the error description
 * @param   {HRTimer}  timer      the current timer
 * @param   {object}  cookieJar  tough cookie jar
 *
 * @return  {object}             the formatted response
 */
const formatError = (url, error, timer, cookieJar) => {
    return { jar: cookieJar, url, ...getResponseTime(timer), error };
};

/**
 * get fetch api request options
 * @private
 *
 * @param   {string}  method  http request method
 * @param   {object}  params  request input params
 *
 * @return  {object}          fetch api options
 */
const getRequestOptions = (method, params) => {
    // json flag - used to add default content type header and to control parsing the response body to json or text, true by default
    let { headers, body, json = true, ...otherParams } = params;

    const mergedHeaders = mergeHeaders(headers, json);

    // stringify body to json if dictated by content-type
    if (body && mergedHeaders["content-type"] === "application/json") {
        body = JSON.stringify(body);
    }

    const options = merge(
        {},
        { method, body, headers: mergedHeaders, ...otherParams },
        defaultedRequestParams
    );

    return { options, json };
};

/**
 * returns the cookie jar for the request
 * @private
 *
 * @param   {object}  options  request options
 *
 * @return  {CookieJar}           the cookie jar
 */
const getCookieJar = (options) => {
    let cookieJar = options.jar || defaultsJar;

    if (cookieJar === true) {
        cookieJar = globalRequestJar;
    } else if (options.jar === undefined) {
        // Create new jar for this request for backwards compatibility
        cookieJar = new tough.CookieJar();
    }

    return cookieJar;
};

/**
 * performs the actual request via the fetch api
 * @private
 *
 */
const request = (method, url, params = {}) => {
    /**
    Chakram Response Object
    @desc Encapsulates the results of a HTTP call into a single object
    @typedef {Object} ChakramResponse
    @property {Error} error - An error when applicable
    @property {Object} response - An {@link http://nodejs.org/api/http.html#http_http_incomingmessage http.IncomingMessage} object
    @property {String|Buffer|Object} body - The response body. Typically a JSON object unless the json option has been set to false, in which case will be either a String or Buffer
    @property {Object} jar - A {@link https://github.com/salesforce/tough-cookie tough cookie} jar
    @property {String} url - The request's original URL
    @property {Number} responseTime - The time taken to make the request (including redirects) at millisecond resolution
    */

    const { options, json } = getRequestOptions(method, params);

    const timer = process.hrtime();

    const cookieJar = getCookieJar(options);

    const fetch = getFetch(cookieJar);

    let deferred = Q.defer();

    fetch(url, options)
        .then((response) => {
            return deferred.resolve(formatResponse(url, options, json, response, timer, cookieJar));
        })
        .catch((error) => {
            return deferred.resolve(formatError(url, error, timer, cookieJar));
        });

    return deferred.promise;
};

/**
Perform HTTP GET request
@param {string} url - fully qualified url
@param {Object} [params] - additional request options, see the popular {@link (https://github.com/node-fetch/node-fetch#options) node-fetch library} for options
@returns {Promise} Promise which will resolve to a {@link ChakramResponse} object
@alias module:chakram.get
 */
const get = (url, params) => {
    return request("GET", url, params);
};

/**
Perform HTTP HEAD request
@param {string} url - fully qualified url
@param {Object} [params] - additional request options, see the popular {@link https://github.com/node-fetch/node-fetch#options) node-fetch library} for options
@returns {Promise} Promise which will resolve to a {@link ChakramResponse} object
@alias module:chakram.head
 */
const head = (url, params) => {
    return request("HEAD", url, params);
};

/**
Perform HTTP OPTIONS request
@param {string} url - fully qualified url
@param {Object} [params] - additional request options, see the popular {@link https://github.com/node-fetch/node-fetch#options) node-fetch library} for options
@returns {Promise} Promise which will resolve to a {@link ChakramResponse} object
@alias module:chakram.options
 */
const options = (url, params) => {
    return request("OPTIONS", url, params);
};

const extendWithData = (data, params) => {
    return { body: data, ...params };
};

/**
Perform HTTP POST request
@param {string} url - fully qualified url
@param {Object} data - a JSON serializable object (unless json is set to false in params, in which case this should be a buffer or string)
@param {Object} [params] - additional request options, see the popular {@link https://github.com/node-fetch/node-fetch#options) node-fetch library} for options
@returns {Promise} Promise which will resolve to a {@link ChakramResponse} object
@alias module:chakram.post
 */
const post = (url, data, params) => {
    return request("POST", url, extendWithData(data, params));
};

/**
Perform HTTP PATCH request
@param {string} url - fully qualified url
@param {Object} data - a JSON serializable object (unless json is set to false in params, in which case this should be a buffer or string)
@param {Object} [params] - additional request options, see the popular {@link https://github.com/node-fetch/node-fetch#options) node-fetch library} for options
@returns {Promise} Promise which will resolve to a {@link ChakramResponse} object
@alias module:chakram.patch
 */
const patch = (url, data, params) => {
    return request("PATCH", url, extendWithData(data, params));
};

/**
Perform HTTP PUT request
@param {string} url - fully qualified url
@param {Object} data - a JSON serializable object (unless json is set to false in params, in which case this should be a buffer or string)
@param {Object} [params] - additional request options, see the popular {@link https://github.com/node-fetch/node-fetch#options) node-fetch library} for options
@returns {Promise} Promise which will resolve to a {@link ChakramResponse} object
@alias module:chakram.put
 */
const put = (url, data, params) => {
    return request("PUT", url, extendWithData(data, params));
};

/**
Perform HTTP DELETE request
@param {string} url - fully qualified url
@param {Object} [data] - a JSON serializable object (unless json is set to false in params, in which case this should be a buffer or string)
@param {Object} [params] - additional request options, see the popular {@link https://github.com/node-fetch/node-fetch#options) node-fetch library} for options
@returns {Promise} Promise which will resolve to a {@link ChakramResponse} object
@alias module:chakram.delete
 */
const deleteRequest = (url, data, params) => {
    return request("DELETE", url, extendWithData(data, params));
};

/**
Alias for chakram.delete. Perform HTTP DELETE request.
@param {string} url - fully qualified url
@param {Object} [data] - a JSON serializable object (unless json is set to false in params, in which case this should be a buffer or string)
@param {Object} [params] - additional request options, see the popular {@link https://github.com/node-fetch/node-fetch#options) node-fetch library} for options
@returns {Promise} Promise which will resolve to a {@link ChakramResponse} object
@alias module:chakram.del
 */
const del = (url, data, params) => {
    return deleteRequest(url, data, params);
};

/**
Sets the default options applied to all future requests.
@param {Object} [defaults] - default request options, see the popular {@link https://github.com/node-fetch/node-fetch#options) node-fetch library} for options
@alias module:chakram.setRequestDefaults
 */
const setRequestDefaults = (defaults) => {
    defaultsJar = defaults.jar;
    defaultedRequestParams = defaults;
};

/**
Clears any previously set default options.
@alias module:chakram.clearRequestDefaults
 */
const clearRequestDefaults = () => {
    defaultedRequestParams = {};
};

/**
 * returns a new cookie jar (instead of getting the jar from the request package)
 *
 * @return  {}  new tough CookieJar
 */
const jar = () => new tough.CookieJar();

module.exports = {
    request,
    get,
    post,
    put,
    head,
    options,
    patch,
    delete: deleteRequest,
    del,
    setRequestDefaults,
    clearRequestDefaults,
    jar,
};
