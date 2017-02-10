var path = require('./../utils/objectPath.js');

/**
 Checks the inclusion of an array member in the response. Defaults to the body JSON. An optional first argument allows sub-element checks.
 @alias module:chakram-expectation.arrayIncluding
 @param {String} [subelement] - if specified a sub-element of the JSON body is checked, specified using dot notation
 @param {String|Object} member - the expected member included in the array
 @example
 it("should check array in body", function () {
     var response = chakram.post("http://httpbin.org/post", ["an", "array"]);
     expect(response).to.have.arrayIncluding("json", "an");
     return chakram.wait();
 });
 */
module.exports = function (chai, utils) {

    utils.addMethod(chai.Assertion.prototype, 'arrayIncluding', function () {
        var object = this._obj.body;
        if (arguments.length === 2) {
            object = path.get(utils, object, arguments[0]);
        }
        var assert = new chai.Assertion(object);
        utils.transferFlags(this, assert, false);
        assert.to.include(arguments[arguments.length-1]);
    });
};