var request = require('request'),
    _ = require('underscore'),
    Q = require('q'),
    chai = require("chai"),
    chaiAsPromised = require("chai-as-promised");
var exports = module.exports = {};

chai.use(require("./matchers/statuscode.js"));
chai.use(chaiAsPromised);

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

exports.expect = function(obj) {
    return chai.expect(obj).eventually;
}

exports.all = Q.all;



