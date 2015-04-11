# Chakram

[![Build Status](https://travis-ci.org/dareid/chakram.svg?branch=master)](https://travis-ci.org/dareid/chakram) [![Test Coverage](https://codeclimate.com/github/dareid/chakram/badges/coverage.svg)](https://codeclimate.com/github/dareid/chakram) [![Code Climate](https://codeclimate.com/github/dareid/chakram/badges/gpa.svg)](https://codeclimate.com/github/dareid/chakram)

Chakram is an API testing framework designed to perform end to end tests on JSON REST endpoints. The library offers a BDD testing style and fully exploits javascript promises - the resulting tests are simple, clear and expressive. The library is built on [node.js](https://nodejs.org/), [mocha](http://mochajs.org/) and [chai](http://chaijs.com/). 

More information is available in the [library's documentation](http://dareid.github.io/chakram/) and its [own tests](https://github.com/dareid/chakram/tree/master/test) which demonstrate all of Chakram's capabilities. Example API tests of publically accessable APIs are available in the [examples directory](https://github.com/dareid/chakram/tree/master/examples).

## Install Chakram
Chakram requires nodejs and NPM to be installed, it is available as an NPM module. Ideally, Chakram should be added to your testing project's devDependancies. This can be achieved with the following command:
```js
npm install chakram --save-dev
```

## Introduction
Chakram builds on top of the mocha testing framework, as such, the tests follow the [BDD style](http://mochajs.org/#getting-started). As this library focuses on testing REST APIs, the tests are naturally asynchronous. Mocha has [native support for promises](http://mochajs.org/#asynchronous-code) which Chakram exploits. All requests and expectations return promises which fulfill to [Chakram response objects](http://dareid.github.io/chakram/global.html#ChakramResponse).

The example below demonstrates a GET request and an assertion of the returned status code. The assertion of the status code returns a promise which is fulfilled once the status code has been checked. 

```js
var chakram = require('chakram'),
    expect = chakram.expect;

describe("Minimal example", function() {    
    it("should provide a simple async testing framework", function () {
        var response = chakram.get("http://httpbin.org/get");
        return expect(response).to.have.status(200);
    });
});
```
Below is a larger example testing the [Random User Generator API](https://randomuser.me/).

```js
var chakram = require('./../lib/chakram.js'),
    expect = chakram.expect;

describe("Random User API", function() {
    var apiResponse;
    
    before(function () {
        apiResponse = chakram.get("http://api.randomuser.me/?gender=female");
    });
    
    it("should return 200 on success", function () {
        return expect(apiResponse).to.have.status(200);
    });
    
    it("should return content type and server headers", function () {
        expect(apiResponse).to.have.header("server");
        expect(apiResponse).to.have.header("content-type", /json/);
        return chakram.wait();
    });
    
    it("should include email, username, password and phone number", function () {
        return expect(apiResponse).to.have.schema('results[0].user', {
            "required": [
                "email", 
                "username", 
                "password", 
                "phone"
            ]
        });
    });
    
    it("should return a female user", function () {
        return expect(apiResponse).to.have.json('results[0].user.gender', 'female');
    });
    
    it("should return a single random user", function () {
        return expect(apiResponse).to.have.schema('results', {minItems: 1, maxItems: 1});
    }); 
    
    it("should not be gzip compressed", function () {
        return expect(apiResponse).not.to.be.encoded.with.gzip;
    });
    
    it("should return a different username on each request", function () {
        this.timeout(10000);
        var multipleResponses = [];
        for(var ct = 0; ct < 5; ct++) {
            multipleResponses.push(chakram.get("http://api.randomuser.me/?gender=female"));
        }
        return chakram.all(multipleResponses).then(function(responses) {
            var returnedUsernames = responses.map(function(response) {
                return response.body.results[0].user.username;
            });
            while (returnedUsernames.length > 0) {
                var username = returnedUsernames.pop();
                expect(returnedUsernames.indexOf(username)).to.equal(-1);
            }
        });
    });
});

```
It is important that tests wait for all requests and assertions to be completed. To help, chakram includes a wait method, this returns a promise which will be fulfilled once all assertions have been performed. In addition, Chakram will fail any tests which do not wait for assertions to complete. Below is a test using the wait method. 

```js
var chakram = require('chakram'),
    expect = chakram.expect;

describe("Minimal example", function() {    
    it("should provide a simple async testing framework", function () {
        var response = chakram.get("http://httpbin.org/get");
        expect(response).to.have.status(200);
        expect(response).not.to.have.header('non-existing-header');
        return chakram.wait();
    });
});
```


## Run Tests
To run Chakram tests, install the Mocha testing framework globally (or as a dev dependancy):
```
npm install -g mocha
```
Once installed, run the tests using the [Mocha command line](http://mochajs.org/#usage), which in its simplest form is:
```
mocha path/to/tests
```