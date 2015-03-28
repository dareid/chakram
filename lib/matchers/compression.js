var confirmCompression = function(expectedCompression) {
    var compression = this._obj.response.headers['content-encoding'];
    this.assert(
        compression === expectedCompression,
        'expected compression to be '+expectedCompression+', but was '+compression,
        'expected compression not to be '+expectedCompression
    );
};

/**
Checks that the response is gzip compressed
@alias module:chakram-expectation.gzip
@example 
it("should detect gzip compression", function () {
    var gzip = chakram.get("http://httpbin.org/gzip");
    return expect(gzip).to.be.encoded.with.gzip;
});
*/    
var gzipAssertation = function () {
    confirmCompression.call(this, 'gzip');
};

/**
Checks that the response is deflate compressed
@alias module:chakram-expectation.deflate
@example 
it("should detect deflate compression", function () {
    var deflate = chakram.get("http://httpbin.org/deflate");
    return expect(deflate).to.be.encoded.with.deflate;
});
*/  
var deflateAssertation = function () {
    confirmCompression.call(this, 'deflate');
};

module.exports = function (chai, utils) {
    utils.addProperty(chai.Assertion.prototype, 'encoded', function () {});
    utils.addProperty(chai.Assertion.prototype, 'gzip', gzipAssertation);
    utils.addProperty(chai.Assertion.prototype, 'deflate', deflateAssertation);
};