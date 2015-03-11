var Q = require('q'),
    _ = require('underscore'),
    methods = require('./methods.js'),
    chakramMatchers = require("./matchers/index.js"),
    chaiAsPromised,
    chai;

var exports = module.exports = {};
_.extend(exports, methods);


exports.initialized = false;

var loadChai = function () {
    if (exports.initialized) {
        delete require.cache[require.resolve('chai-as-promised')];
        delete require.cache[require.resolve('chai')];
    }
    chai = require('chai');
    chaiAsPromised = require("chai-as-promised");
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

afterEach(function() {
    recordedExpects = [];
});

exports.waitFor = function(promiseArray) {
    return Q.all(promiseArray).then(function(resolvedArray) {
        var deferred = Q.defer();
        deferred.resolve(resolvedArray[resolvedArray.length - 1]);
        return deferred.promise;
    });
};
exports.wait = function() {
    return exports.waitFor(recordedExpects);
};