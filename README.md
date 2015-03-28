# Chakram

[![Build Status](https://travis-ci.org/dareid/chakram.svg?branch=master)](https://travis-ci.org/dareid/chakram) [![Test Coverage](https://codeclimate.com/github/dareid/chakram/badges/coverage.svg)](https://codeclimate.com/github/dareid/chakram) [![Code Climate](https://codeclimate.com/github/dareid/chakram/badges/gpa.svg)](https://codeclimate.com/github/dareid/chakram)

Chakram is a REST API testing framework designed to perform end to end tests on JSON REST endpoints. The library offers a BDD testing style and fully exploits javascript promises - the resulting tests are simple, clear and expressive. The library is built on [node.js](https://nodejs.org/), [mocha](http://mochajs.org/) and [chai](http://chaijs.com/). 

More information is available in the [library's documentation](http://dareid.github.io/chakram/) and its [own tests](https://github.com/dareid/chakram/tree/master/test) which demonstrate all of Chakram's functionality. 

## Install Chakram
Chakram requires nodejs and NPM to be installed, it is available as an NPM module. Ideally, Chakram should be added to your testing project's devDependancies. This can be achieved with the following command:
```js
npm install chakram --save-dev
```

## Introduction
This test tool builds on top of the mocha testing framework, as such, the tests follow the typical BDD style. As this library focuses on testing REST API endpoints, the tests are naturally asynchronous. The library is written to fully exploit javascript promises. Mocha has native support for promises, simply return a promise from 'it' and the test runner will wait until the promise has been fulfilled. 

```js
var chakram = require('chakram'),
    expect = chakram.expect;

describe("Minimal example", function() {    
    it("should provide a simple async testing framework", function () {
        var request = chakram.get("http://httpbin.org/get");
        return expect(request).to.have.status(200);
    });
});
```
The example above demonstrates a GET request and an assertation of the returned status code. The example 'it' returns a promise which is fulfilled once the status code has been checked. Both the request and the expect statement return promises, it is important to return the correct promise otherwise the test may finish before the status code is checked. To help, chakram includes a wait method, which will return a promise which will be fulfilled once all assertations have been fulfilled. Below is a similar test rewritten using the wait method. In addition, the library will fail any tests which finish before all the assertations have fulfilled.

```js
var chakram = require('chakram'),
    expect = chakram.expect;

describe("Minimal example", function() {    
    it("should provide a simple async testing framework", function () {
        var request = chakram.get("http://httpbin.org/get");
        expect(request).to.have.status(200);
        expect(request).not.to.have.header('non-existing-header');
        return chakram.wait();
    });
});
```

Below is a larger example testing the [Random User Generator API](https://randomuser.me/).

```js
var chakram = require('chakram'),
    expect = chakram.expect;

describe("Random User API", function() {
    var apiRequest;
    
    before(function () {
        apiRequest = chakram.get("http://api.randomuser.me/?gender=female");
    });
    
    it("should return 200 on success", function () {
        return expect(apiRequest).to.have.status(200);
    });
    
    it("should return content type and server headers", function () {
        expect(apiRequest).to.have.header("server");
        expect(apiRequest).to.have.header("content-type", /json/);
        return chakram.wait();
    });
    
    it("should include email, username, password and phone number", function () {
        return expect(apiRequest).to.have.schema('results[0].user', {
            "required": [
                "email", 
                "username", 
                "password", 
                "phone"
            ]
        });
    });
    
    it("should return a female user", function () {
        return expect(apiRequest).to.have.json('results[0].user.gender', 'female');
    });
    
    it("should return a single random user", function () {
        return expect(apiRequest).to.have.schema('results', {minItems: 1, maxItems: 1});
    }); 
    
    it("should not be gzip compressed", function () {
        return expect(apiRequest).not.to.be.encoded.with.gzip;
    });
    
    it("should return a different username on each request", function () {
        this.timeout(10000);
        var multipleRequests = [];
        for(var ct = 0; ct < 5; ct++) {
            multipleRequests.push(chakram.get("http://api.randomuser.me/?gender=female"));
        }
        return chakram.all(multipleRequests).then(function(responses) {
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

## Run Tests
To run Chakram tests, install the Mocha testing framework globally (or as a dev dependancy):
```
npm install -g mocha
```
Once installed, run the tests using the [Mocha command line](http://mochajs.org/#usage), which in its simplest form is:
```
mocha path/to/tests
```