var chakramMatchers = require("./assertions/index.js"),
    chaiSubset = require('chai-subset'),
    chaiAsPromised,
    plugins = {};

var exports = module.exports = {};
exports.chai = null;

var extendChaiPromise = function () {
    chaiAsPromised.transferPromiseness = function (assertion, promise) {
        assertion.then = promise.then.bind(promise);
        assertion.isFulfilled = promise.isFulfilled.bind(promise);
    };
};

var loadChai = function () {
    if (exports.chai !== null) {
        //need to remove to reinitialise with new plugins
        delete require.cache[require.resolve('chai-as-promised')];
        delete require.cache[require.resolve('chai')];
    }
    exports.chai = require('chai');
    chaiAsPromised = require("chai-as-promised");
    extendChaiPromise();
};

/**
Initialise the chakram package with custom chai plugins. This is no longer recommended, instead use either addMethod, addProperty or addRawPlugin.
@deprecated since 0.2.0
@param {...ChaiPlugin} customChaiPlugin - One or multiple chai plugins
@alias module:chakram.initialize
@example 
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
 */
exports.initialize = function (customChaiPlugin) {
    loadChai();
    for (var ct = 0; ct < arguments.length; ct++) {
        exports.chai.use(arguments[ct]);
    }
    for(var key in plugins) {
        exports.chai.use(plugins[key]);
    }
    chakramMatchers.map(function (matcher) {
        exports.chai.use(matcher);
    });
    exports.chai.use(chaiSubset);
    exports.chai.use(chaiAsPromised);
};

/**
Add a raw chai plugin to Chakram. See Chai's documentation for more details.
@param {String} name - The plugin's name, used as an identifier
@param {function} plugin - A Chai plugin function, function should accept two arguments, the chai object and the chai utils object
@alias module:chakram.addRawPlugin
@example 
chakram.addRawPlugin("unavailable", function (chai, utils) {
    utils.addProperty(chai.Assertion.prototype, 'unavailable', function () {
        var statusCode = this._obj.response.statusCode;
        this.assert(statusCode === 503, 
            'expected status code '+statusCode+' to equal 503', 
            'expected '+statusCode+' to not be equal to 503');
    });
});
var unavailableReq = chakram.get("http://httpbin.org/status/503");
return expect(unavailableReq).to.be.unavailable;
 */
exports.addRawPlugin = function (name, plugin) {
    plugins[name] = plugin;
    exports.initialize();
};

/**
Add a new property assertion to Chakram. Properties should be used over methods when there is no arguments required for the assertion.  
@param {String} name - The plugin's name, used as an identifier
@param {function} plugin - A function which should accept one argument; a {@link ChakramResponse} object
@alias module:chakram.addProperty
@example 
chakram.addProperty("httpbin", function (respObj) {
    var hostMatches = /httpbin.org/.test(respObj.url);
    this.assert(hostMatches, 
        'expected '+respObj.url+' to contain httpbin.org', 
        'expected '+respObj.url+' to not contain httpbin.org');
});
var httpbin = chakram.get("http://httpbin.org/status/200");
return expect(httpbin).to.be.at.httpbin;
 */
exports.addProperty = function (name, callback) {
    exports.addRawPlugin(name, function (chai, utils) {
        utils.addProperty(chai.Assertion.prototype, name, function () {
            callback.call(this, this._obj);
        });
    });
};

/**
Add a new method assertion to Chakram. Methods should be used when the assertion requires parameters.  
@param {String} name - The plugin's name, used as an identifier
@param {function} plugin - A function which should accept one or more arguments. The first argument will be a {@link ChakramResponse} object, followed by any arguments passed into the assertion.
@alias module:chakram.addMethod
@example 
chakram.addMethod("statusRange", function (respObj, low, high) {
    var inRange = respObj.response.statusCode >= low && respObj.response.statusCode <= high;
    this.assert(inRange, 'expected '+respObj.response.statusCode+' to be between '+low+' and '+high, 'expected '+respObj.response.statusCode+' not to be between '+low+' and '+high);
});
var twohundred = chakram.get("http://httpbin.org/status/200");
return expect(twohundred).to.have.statusRange(0, 200);
 */
exports.addMethod = function (name, callback) {
    exports.addRawPlugin(name, function (chai, utils) {
        utils.addMethod(chai.Assertion.prototype, name, function () {
            var args = Array.prototype.slice.call(arguments);
            args.unshift(this._obj);
            callback.apply(this, args);
        });
    });
};