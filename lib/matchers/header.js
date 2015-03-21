/**
Either checks that a header exists or ensures the header matches a given value
@alias module:chakram-expectation.header
@param {String} name - checks a header with this name exists
@param {String | RegExp} [value] - if specified, checks the header matches the given string or regular expression
@example 
it("should allow checking of HTTP headers", function () {
    var request = chakram.get("http://httpbin.org/get");
    return chakram.waitFor([
        expect(request).to.have.header('content-type'),
        expect(request).to.have.header('content-type', 'application/json'),
        expect(request).to.have.header('content-type', /json/)
    ]);
});
 */

module.exports = function (chai, utils) {

    utils.addMethod(chai.Assertion.prototype, 'header', function (key, value) {
        
        var headerValue = this._obj.response.headers[key.toLowerCase()];
        
        if(arguments.length === 1) {
            this.assert(
                headerValue !== undefined && headerValue !== null, 
                'expected header '+ key +' to exist', 
                'expected header '+ key +' not to exist'
            );
        } else if (value instanceof RegExp) {
            this.assert(
                value.test(headerValue),
                'expected header '+ key + ' with value ' + headerValue + ' to match regex '+value,
                'expected header '+ key + ' with value ' + headerValue + ' not to match regex '+value
            );
        } else {
            this.assert(
                headerValue === value,
                'expected header '+ key + ' with value ' + headerValue + ' to match '+value,
                'expected header '+ key + ' with value ' + headerValue + ' not to match '+value
            );
        }
    });
};