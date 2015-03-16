# chakram

[![Build Status](https://travis-ci.org/dareid/chakram.svg?branch=master)](https://travis-ci.org/dareid/chakram)

[![Test Coverage](https://codeclimate.com/github/dareid/chakram/badges/coverage.svg)](https://codeclimate.com/github/dareid/chakram)

# API Reference
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
Only call if using custom plugins

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

