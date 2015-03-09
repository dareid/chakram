var request = require('request'),
    _ = require('underscore'),
    Q = require('q'),
    chai = require("chai"),
    chaiAsPromised = require("chai-as-promised"),
    chakramMatchers = require("./matchers/matchers.js");

var exports = module.exports = {};

exports.initialized = false;

exports.initialize = function (customChaiPlugin) {
    for(var ct = 0; ct < arguments.length; ct++) {
        chai.use(arguments[ct]);
    }
    chakramMatchers.map(function(matcher) {
        chai.use(matcher);
    });
    chai.use(chaiAsPromised);
    exports.initialized = true;
};

var call = function (method, url, params) {
    var options = params || {};
    _.extend(options, {
        url: url,
        method: method
    });
    var deferred = Q.defer();
    request(options, function (error, response, body) {
        deferred.resolve({
            error : error,
            response: response,
            body: body
        });
    });
    return deferred.promise;
};

exports.get = function(url, params) {
    return call('GET', url, params);
};


var recordedExpects = [];

exports.expect = function(obj) {
    if(exports.initialized === false) {
        exports.initialize();
    }
    var test = chai.expect(obj).eventually;
    recordedExpects.push(test);
    return test;
};

afterEach(function() {
    recordedExpects = [];
});

exports.waitFor = Q.all;
exports.wait = function() {
    return Q.all(recordedExpects);
};