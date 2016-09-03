/**
Checks the response time of the response is less than or equal to the provided millisecond value.
@alias module:chakram-expectation.responsetime
@param {Number} milliseconds - the expected maximum response time in milliseconds
@example
it("should allow checking maximum response time", function () {
    var request = chakram.get("http://httpbin.org/delay/2");
    return expect(request).to.have.responsetime(3000);
});
 */

module.exports = function (chai, utils) {

    utils.addMethod(chai.Assertion.prototype, 'responsetime', function (milliseconds) {
        var responseTime = this._obj.responseTime;
        this.assert(
            responseTime <= milliseconds,
            'expected response time of ' + responseTime + 'ms to be less than or equal to ' + milliseconds + 'ms',
            'expected response time of ' + responseTime + 'ms to not be less than or equal to ' + milliseconds + 'ms'
        );
    });
};
