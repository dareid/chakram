# Chakram

[![Build Status](https://travis-ci.org/dareid/chakram.svg?branch=master)](https://travis-ci.org/dareid/chakram) [![Test Coverage](https://codeclimate.com/github/dareid/chakram/badges/coverage.svg)](https://codeclimate.com/github/dareid/chakram)

Chakram is a REST API testing framework designed to perform end to end tests on JSON REST endpoints. The library offers a BDD testing style and fully exploits javascript promises - the resulting tests are simple, clear and expressive. The library is built on [node.js](https://nodejs.org/), [mocha](http://mochajs.org/) and [chai](http://chaijs.com/). 

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

## Install Chakram
Chakram requires nodejs and NPM to be installed, it is available as an NPM module. Ideally, Chakram should be added to your testing project's devDependancies. This can be achieved with the following command:
```js
npm install chakram --save-dev
```

## API Documentation

Chakram Module

**Example**  

```js
var chakram = require("chakram");
```

**Members**

* [chakram](#module_chakram)
  * [chakram.initialize(...customChaiPlugin)](#module_chakram.initialize)
  * [chakram.expect(value)](#module_chakram.expect)
  * [chakram.waitFor(promiseArray)](#module_chakram.waitFor)
  * [chakram.wait()](#module_chakram.wait)

<a name="module_chakram.initialize"></a>
##chakram.initialize(...customChaiPlugin)
Initialise the chakram package with custom chai plugins.
Only call if you want to exploit custom plugins.

**Params**

- ...customChaiPlugin `ChaiPlugin` - One or multiple chai plugins  

**Example**  

```js
var customProperty = function (chai, utils) {
   utils.addProperty(chai.Assertion.prototype, 'teapot', function () {
       var statusCode = this._obj.response.statusCode;
       this.assert(
           statusCode === 418, 
           'expected status code '+statusCode+' to equal 418', 
           'expected '+statusCode+' to not be equal to 418'
       );
   });
};
chakram.initialise(customProperty);
```

<a name="module_chakram.expect"></a>
##chakram.expect(value)
Chakram assertation constructor. Extends chai's extend method with Chakram's HTTP matchers.
Please see [chai's API documentation](http://chaijs.com/api/bdd/) for default chai matchers and the matchers section for Chakram's matchers.

**Params**

- value `*` - The variable to run assertations on, can be a Chakram request promise  

**Returns**: `Object` - chai expectation object  
**Example**  

```js
var expect = chakram.expect;
it("should support chakram and chai expectations", function () {
   var chakramRequest = chakram.get("google.com");
   expect(true).to.be.true;
   expect(chakramRequest).to.have.status(200);
   expect(1).to.be.below(10);
   expect("teststring").to.be.a('string');
});
```

<a name="module_chakram.waitFor"></a>
##chakram.waitFor(promiseArray)
Returns a promise which is fulfilled once all promises in the array argument are fulfilled.
Similar to Q.all, however, the resulting resolved object is a single object rather than an array.

**Params**

- promiseArray `Array.<Promise>` - An array of promises to wait for  

**Returns**: `Promise`  
**Example**  

```js 
it("should support grouping multiple tests", function () {
   var request = request = chakram.get("http://httpbin.org/get");
   return chakram.waitFor([
       expect(request).to.have.status(200),
       expect(request).not.to.have.status(404)
   ]);
});
```

<a name="module_chakram.wait"></a>
##chakram.wait()
Returns a promise which is fulfilled once all chakram expectations are fulfilled.
This works by recording all chakram expectations called within an 'it' and waits for all the expectations to finish before resolving the returned promise.

**Returns**: `Promise`  
**Example**  

```js
it("should support auto waiting for tests", function() {
   var request = request = chakram.get("http://httpbin.org/get");
   expect(request).to.have.status(200);
   expect(request).not.to.have.status(404);
   return chakram.wait();
});
```


