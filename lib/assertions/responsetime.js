/**
Checks the response time of the response.
Can be used either as :
  - a method, where the response time should be less than or equal to the provided value
  - a chain, where methods like `below`, `above` and `within` can be used
@alias module:chakram-expectation.responsetime
@param {Number} milliseconds - (if used as a method) the expected maximum response time in milliseconds
@example
it("should allow checking maximum response time", function () {
    var request = chakram.get("http://httpbin.org/delay/2");
    return expect(request).to.have.responsetime(3000);
});
it("should be compatible with chaining", function () {
    var request = chakram.get("http://httpbin.org/delay/2");
    return expect(request).to.have.responsetime.below(3000);
});
 */

module.exports = function (chai, utils) {

    utils.addChainableMethod(chai.Assertion.prototype, 'responsetime', function (milliseconds) {
        var responseTime = this._obj;
        this.assert(
            responseTime <= milliseconds,
            'expected reponse time of ' + responseTime + 'ms to be less than or equal to ' + milliseconds + 'ms',
            'expected reponse time of ' + responseTime + 'ms to not be less than or equal to ' + milliseconds + 'ms'
        );
    }, function () {
        var responseTime = this._obj.responseTime;
        utils.flag(this, 'object', responseTime);
    });
};
