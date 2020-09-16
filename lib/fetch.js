const nodeFetch = require("node-fetch");
const fetchCookieNodeFetch = require("fetch-cookie/node-fetch");

/**
 * returns fetch
 * @private
 * @param   {CookieJar}  cookieJar  the cookie jar to use for fetch
 *
 * @return  {[type]}             [return description]
 */
const getFetch = (cookieJar) => {
    const { debug } = require("./debug");

    const baseFetch = fetchCookieNodeFetch(nodeFetch, cookieJar, false);

    if (!debug.isDebugging) {
        return baseFetch;
    }

    const { fetch: fetchDebug } = require("./fetch-debug")(nodeFetch);

    fetchDebug.on("fetch", debug.debuggerFn);
    fetchDebug.on("response", debug.debuggerFn);

    return fetchCookieNodeFetch(fetchDebug, cookieJar, false);
};

module.exports = { getFetch };
