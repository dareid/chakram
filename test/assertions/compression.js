var chakram = require('./../../lib/chakram.js'),
    expect = chakram.expect;

describe("Chakram Assertions", function() {
    
    describe("Compression", function() {
        
        it("should allow assertions on uncompressed responses", function () {
            var noncompressed = chakram.get("http://httpbin.org/get");
            expect(noncompressed).not.to.be.encoded.with.gzip;
            expect(noncompressed).not.to.be.encoded.with.deflate;
            return chakram.wait();
        });
        
        it("should detect gzip compression", function () {
            var gzip = chakram.get("http://httpbin.org/gzip");
            expect(gzip).to.be.encoded.with.gzip;
            expect(gzip).not.to.be.encoded.with.deflate;
            return chakram.wait();
        });
        
        it("should detect deflate compression", function () {
            var deflate = chakram.get("http://httpbin.org/deflate");
            expect(deflate).not.to.be.encoded.with.gzip;
            expect(deflate).to.be.encoded.with.deflate;
            return chakram.wait();
        });
        
        it("should support shorter language chains", function () {
            var deflate = chakram.get("http://httpbin.org/deflate");
            expect(deflate).not.to.be.gzip;
            expect(deflate).to.be.deflate;
            return chakram.wait();
        });
    });    

});