# Chakram

[![Build Status](https://travis-ci.org/dareid/chakram.svg?branch=master)](https://travis-ci.org/dareid/chakram) [![Test Coverage](https://codeclimate.com/github/dareid/chakram/badges/coverage.svg)](https://codeclimate.com/github/dareid/chakram) [![Code Climate](https://codeclimate.com/github/dareid/chakram/badges/gpa.svg)](https://codeclimate.com/github/dareid/chakram) [![Gitter](https://img.shields.io/badge/gitter-join%20chat-brightgreen.svg)](https://gitter.im/dareid/chakram)

Chakram is an API testing framework designed to perform end to end tests on JSON REST endpoints.

The library offers a BDD testing style and fully exploits javascript promises - the resulting tests are simple, clear and expressive. Chakram is built on [node.js](https://nodejs.org/), [mocha](http://mochajs.org/) and [chai](http://chaijs.com/).

This readme offers an introduction to the library. For more information, visit Chakram's [documentation](http://dareid.github.io/chakram/) and [tests](https://github.com/dareid/chakram/tree/master/test) which demonstrate all of Chakram's capabilities. In addition, example tests of publicly accessible APIs are available in the [examples directory](https://github.com/dareid/chakram/tree/master/examples). If required, assistance can be found in the project's [gitter chat room](https://gitter.im/dareid/chakram).

## Features
 - HTTP specific assertions. Allows testing of:
  + Status codes
  + Cookie presence and value
  + Header presence and value
  + JSON values
  + JSON structure (using the [JSON schema specification](http://json-schema.org/documentation.html))
  + Compression
  + Response times

- BDD formatting and hooks (e.g. beforeEach, afterEach)
- Promise based
- Plugin support
- Custom assertions
- Exports results in a variety of formats
- Debugging support

## Plugins
Awesome plugins from the community:
 - [Joi Schema Assertion](https://github.com/roberto/chakram-joi)

We would love to see more plugins! If you have a plugin, please add it to the list.

## Getting Started

### Install Chakram
Chakram requires Node.js and npm to be installed. It is available as an npm module. Ideally, Chakram should be added to your testing project's devDependencies. This can be achieved with the following command:
```js
npm install chakram --save-dev
```

### Writing Tests

Chakram builds on top of the mocha testing framework.  As such, the tests follow mocha's [BDD style](http://mochajs.org/#getting-started). The following sections introduce the various aspects of writing a Chakram test.

#### Making Requests

Chakram makes use of the [request library](https://github.com/request/request) and as such boasts a comprehensive request capability. Chakram exposes helper methods for the most common HTTP request verbs. The methods typically require the URL as the first parameter, the request body (if applicable) as the second parameter and any request options as an optional last parameter. For full documentation of the request methods see [here](http://dareid.github.io/chakram/jsdoc/module-chakram.html). The request methods return a promise which resolves to a [Chakram response object](http://dareid.github.io/chakram/jsdoc/global.html#ChakramResponse).

Below is an example of making a HTTP GET request:
```js
var chakram = require('chakram');

describe("Chakram", function() {
    it("should offer simple HTTP request capabilities", function () {
        return chakram.get("http://httpbin.org/get");
    });
});
```

#### Testing Responses

Chakram offers a range of HTTP specific assertions which can test the information returned from API requests. Chakram offers a BDD testing style through Chakram's `expect` interface.

When testing API responses, pass the request promise as an argument into chakram.expect. This will return an object which exposes the Chakram and Chai assertions. Perform an assertion by calling the desired [Chakram assertion method](http://dareid.github.io/chakram/jsdoc/module-chakram-expectation.html). [Chai properties](http://chaijs.com/api/bdd/) can be used as a prefix to the assertion, improving the test's readability.

The assertion is performed once the response is received (i.e. the request promise is fulfilled). Chakram assertions return a promise which resolve to a [Chakram response object](http://dareid.github.io/chakram/jsdoc/global.html#ChakramResponse) once the test has been performed.

Below is an example of testing the status code of a HTTP GET request:
```js
var chakram = require('chakram'),
    expect = chakram.expect;

describe("Chakram", function() {
    it("should provide HTTP specific assertions", function () {
        var response = chakram.get("http://httpbin.org/get");
        return expect(response).to.have.status(200);
    });
});
```

In addition to the HTTP specific assertions, chakram.expect exposes all of [Chai's BDD properties and methods](http://chaijs.com/api/bdd/). Documentation for the HTTP specific assertions can be seen [here](http://dareid.github.io/chakram/jsdoc/module-chakram-expectation.html).

#### Waiting

As this library focuses on testing REST APIs, the tests are naturally asynchronous. Mocha has [native support for promises](http://mochajs.org/#asynchronous-code), which Chakram exploits. Returning a promise from an `it` callback will cause the test to wait until the promise resolves before continuing. Chakram's requests and expectations return promises which fulfill to [Chakram response objects](http://dareid.github.io/chakram/jsdoc/global.html#ChakramResponse). These promises can be returned to ensure the test waits for them to complete (as can be seen in the previous two examples).

It is important that tests wait for all requests and assertions to be completed. To help, chakram includes a wait method. This returns a promise which will be fulfilled once all assertions have been performed. Furthermore, Chakram will fail any tests which do not wait for assertions to complete. Below is a test using the wait method.

```js
var chakram = require('chakram'),
    expect = chakram.expect;

describe("Chakram", function() {
    it("should provide a simple async testing framework", function () {
        var response = chakram.get("http://httpbin.org/get");
        expect(response).to.have.status(200);
        expect(response).not.to.have.header('non-existing-header');
        return chakram.wait();
    });
});
```

#### Complex Promise Use

Due to the use of promises, complex tests can be written requiring chains of requests and assertions. An example can be seen below:

```js
describe("Chakram", function () {
  it("should support sequential API interaction", function () {
    var artist = "Notorious B.I.G.";
    return chakram.get("https://api.spotify.com/v1/search?q="+artist+"&type=artist")
    .then(function (searchResponse) {
      var bigID = searchResponse.body.artists.items[0].id;
      return chakram.get("https://api.spotify.com/v1/artists/"+bigID+"/top-tracks?country=GB");
    })
    .then(function (topTrackResponse) {
      var topTrack = topTrackResponse.body.tracks[0];
      expect(topTrack.name).to.contain("Old Thing Back");
    });
  });
});
```

Chakram exposes three promise related methods:
 - [all](http://dareid.github.io/chakram/jsdoc/module-chakram.html#.all), which takes an array of promises and returns a promise which is fulfilled once all promises in the provided array are fulfilled. The fulfillment value of the returned promise is an array of the fulfillment values of the promises which were passed to the function.
 - [wait](http://dareid.github.io/chakram/jsdoc/module-chakram.html#.wait), which returns a promise which is fulfilled once all Chakram expectations are fulfilled.
 - [waitFor](http://dareid.github.io/chakram/jsdoc/module-chakram.html#.waitFor), which takes an array of promises and returns a promise which is fulfilled once all promises in the provided array are fulfilled.  This is similar to chakram.all, except it is fulfilled with the fulfillment value of the last promise in the provided array.

### Running Tests
To run Chakram tests, install the Mocha testing framework globally (or as a dev dependency):
```
npm install -g mocha
```
Once installed, run the tests using the [Mocha command line](http://mochajs.org/#usage), which in its simplest form is:
```
mocha path/to/tests
```
Test results can be exported in multiple formats, Mocha's builtin formats are described [here](http://mochajs.org/#reporters) and export plugins for Mocha are available on NPM.

### Adding Assertions

New assertions can be easily added to Chakram. The [plugin tests](https://github.com/dareid/chakram/blob/master/test/plugins.js) demonstrate how properties and methods can be added. Further information is available in [Chai's plugin documentation](http://chaijs.com/guide/plugins/).

## Contributing
Issues, pull requests and questions are welcomed.

### Pull Requests

 - Fork the repository
 - Make changes
 - If required, write tests covering the new functionality (tests are normally written against [httpbin.org](http://httpbin.org/))
 - Ensure all tests pass and 100% code coverage is achieved (run `npm test`)
 - Raise pull request
