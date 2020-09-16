const { EventEmitter } = require("events");

function fetchDecorator(nodeFetch) {
    let lib = nodeFetch;
    let { Request } = lib;
    let { fetch = lib } = lib;

    lib.fetch = (...args) => {
        let request = new Request(...args);

        let event = new FetchEvent({ request });
        lib.fetch.emit("fetch", event);

        return fetch(request).then((response) => {
            const res = new FetchResponse({ response });
            lib.fetch.emit("response", res);

            return response;
        });
    };

    Object.setPrototypeOf(lib.fetch, new EventEmitter());

    return lib;
}

const getHeaders = (headers) => {
    const headersObject = {};

    if (!headers) {
        return headersObject;
    }

    for (let [key, value] of headers.entries()) {
        headersObject[key] = value;
    }

    return headersObject;
};

class FetchEvent {
    constructor(init) {
        this.type = "request";
        this.url = init.request.url;
        this.method = init.request.method;
        this.headers = getHeaders(init.request.headers);
    }
}

class FetchResponse {
    constructor(init) {
        this.type = "response";
        this.status = init.response.status;
        this.headers = getHeaders(init.response.headers);
        this.url = init.response.url;
    }
}

module.exports = fetchDecorator;
