var Q = require('q'),
    extend = require('extend-object'),
    methods = require('./methods.js'),
    chakramMatchers = require("./matchers/index.js"),
    chaiAsPromised,
    chai;

var exports = module.exports = {};
extend(exports, methods);


exports.initialized = false;

var extendChaiPromise = function () {
    chaiAsPromised.transferPromiseness = function (assertion, promise) {
        assertion.then = promise.then.bind(promise);
        assertion.isFulfilled = promise.isFulfilled.bind(promise);
    };
};

var loadChai = function () {
    if (exports.initialized) {
        delete require.cache[require.resolve('chai-as-promised')];
        delete require.cache[require.resolve('chai')];
    }
    chai = require('chai');
    chaiAsPromised = require("chai-as-promised");
    extendChaiPromise();
};

exports.initialize = function (customChaiPlugin) {
    loadChai();
    for(var ct = 0; ct < arguments.length; ct++) {
        chai.use(arguments[ct]);
    }
    chakramMatchers.map(function(matcher) {
        chai.use(matcher);
    });
    chai.use(chaiAsPromised);
    exports.initialized = true;
};

var recordedExpects = [];

exports.expect = function(obj) {
    if(exports.initialized === false) {
        exports.initialize();
    }
    if (obj !== undefined && obj !== null && obj.then !== undefined) {
        var test = chai.expect(obj).eventually;
        recordedExpects.push(test);
        return test;
    } else {
        return chai.expect(obj);   
    }
};

exports.waitFor = function(promiseArray, x) {
    return Q.all(promiseArray).then(function(resolvedArray) {
        var deferred = Q.defer();
        deferred.resolve(resolvedArray[resolvedArray.length - 1]);
        return deferred.promise;
    });
};
exports.wait = function() {
    return exports.waitFor(recordedExpects, true);
};

var warnUser = function (message) {
    throw new Error(message);
};

afterEach(function() {
    for(var ct = 0; ct < recordedExpects.length; ct++) {
        if(recordedExpects[ct].isFulfilled !== undefined && recordedExpects[ct].isFulfilled() === false) {
            warnUser("Some expectation promises were not fulfilled before the test finished. Ensure you are waiting for all the expectations to run");
            break;
        }
    }
    recordedExpects = [];
});