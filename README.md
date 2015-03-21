# Chakram

[![Build Status](https://travis-ci.org/dareid/chakram.svg?branch=master)](https://travis-ci.org/dareid/chakram) [![Test Coverage](https://codeclimate.com/github/dareid/chakram/badges/coverage.svg)](https://codeclimate.com/github/dareid/chakram)

Chakram is a REST API testing framework designed to perform end to end tests on JSON REST endpoints. The library offers a BDD testing style and fully exploits javascript promises - the resulting tests are simple, clear and expressive. The library is built on [node.js](https://nodejs.org/), [mocha](http://mochajs.org/) and [chai](http://chaijs.com/). 

## Install Chakram
Chakram requires nodejs and NPM to be installed, it is available as an NPM module. Ideally, Chakram should be added to your testing project's devDependancies. This can be achieved with the following command:
```js
npm install chakram --save-dev
```

## Example

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
        return expect(apiRequest).to.have.schema('results.0.user', {
            "required": [
                "email", 
                "username", 
                "password", 
                "phone"
            ]
        });
    });
    
    it("should return a female user", function () {
        return expect(apiRequest).to.have.json('results.0.user.gender', 'female');
    });
    
    it("should return a single random user", function () {
        return expect(apiRequest).to.have.schema('results', {minItems: 1, maxItems: 1});
    }); 
    
    it("should return a different username when called again", function () {
        var firstUsername;
        
        return apiRequest.then(function(obj) {
            firstUsername = obj.body.results[0].user.username;
            return chakram.get("http://api.randomuser.me/?gender=female");
        })
        .then(function(obj) {
            var secondUsername = obj.body.results[0].user.username;
            expect(firstUsername).not.to.equal(secondUsername);
        });
    });
});

```
For more examples please explore the project's test folder, which includes examples of all chakram's capabilites.