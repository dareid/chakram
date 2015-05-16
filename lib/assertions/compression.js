module.exports = function (chai, utils) {
    
    var confirmCompression = function(expectedCompression) {
        this.to.have.header('content-encoding', expectedCompression);
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
    var gzipAssertion = function () {
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
    var deflateAssertion = function () {
        confirmCompression.call(this, 'deflate');
    };
    
    utils.addProperty(chai.Assertion.prototype, 'encoded', function () {});
    utils.addProperty(chai.Assertion.prototype, 'gzip', gzipAssertion);
    utils.addProperty(chai.Assertion.prototype, 'deflate', deflateAssertion);
};