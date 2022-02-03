var path = require("./../utils/objectPath.js");

/**
 Checks the length of an array in the response. Defaults to the body JSON. An optional first argument allows sub-element checks.
 @alias module:chakram-expectation.arrayLength
 @param {String} [subelement] - if specified a sub-element of the JSON body is checked, specified using dot notation
 @param {Number} length - the expected length of the array
 @example
 it("should check length of array", function () {
     var response = chakram.post("http://httpbin.org/post", ["an", "array"]);
     expect(response).to.have.arrayLength(2);
     return chakram.wait();
 });
 */
module.exports = function (chai, utils) {
    utils.addMethod(chai.Assertion.prototype, "arrayLength", function () {
        var object = this._obj.body;
        if (arguments.length === 2) {
            object = path.get(utils, object, arguments[0]);
        }
        var assert = new chai.Assertion(object);
        utils.transferFlags(this, assert, false);
        assert.to.have.lengthOf(arguments[arguments.length - 1]);
    });
};
