/**
Checks the status code of the response
@alias module:chakram-expectation.status
@param {Number} code - the expected status code from the response
@example 
it("should allow checking of the response's status code", function () {
    var response = chakram.get("http://httpbin.org/get");
    return expect(response).to.have.status(200);
});
 */

module.exports = function (chai, utils) {

    utils.addMethod(chai.Assertion.prototype, 'status', function (status) {
        var respStatus = this._obj.response.statusCode;
        this.assert(
            respStatus === status, 
            'expected status code ' + respStatus + ' to equal ' + status, 
            'expected status code ' + respStatus + ' not to equal ' + status
        );
    });
};