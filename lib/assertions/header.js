/**
Either checks that a header exists or ensures the header matches a given value
@alias module:chakram-expectation.header
@param {String} name - checks a header with this name exists
@param {String | RegExp | function} [value] - if specified, checks the header matches the given string or regular expression OR calls the provided function passing the header's value
@example 
it("should allow checking of HTTP headers", function () {
    var response = chakram.get("http://httpbin.org/get");
    expect(response).to.have.header('content-type');
    expect(response).to.have.header('content-type', 'application/json');
    expect(response).to.have.header('content-type', /json/);
    expect(response).to.have.header('content-type', function(contentType) {
        expect(contentType).to.equal('application/json');
    });
    return chakram.wait();
});
 */

module.exports = function (chai, utils) {

    utils.addMethod(chai.Assertion.prototype, 'header', function (key, expected) {
        
        var headerValue = this._obj.response.headers[key.toLowerCase()];
        
        if(arguments.length === 1) {
            this.assert(
                headerValue !== undefined && headerValue !== null, 
                'expected header '+ key +' to exist', 
                'expected header '+ key +' not to exist'
            );
        } else if (expected instanceof RegExp) {
            this.assert(
                expected.test(headerValue),
                'expected header '+ key + ' with value ' + headerValue + ' to match regex '+expected,
                'expected header '+ key + ' with value ' + headerValue + ' not to match regex '+expected
            );
        } else if (typeof(expected) === 'function') {
            expected(headerValue);
        } else {
            this.assert(
                headerValue === expected,
                'expected header '+ key + ' with value ' + headerValue + ' to match '+expected,
                'expected header '+ key + ' with value ' + headerValue + ' not to match '+expected
            );
        }
    });
};