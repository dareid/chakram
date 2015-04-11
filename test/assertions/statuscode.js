var chakram = require('./../../lib/chakram.js'),
    expect = chakram.expect;

describe("Chakram Assertions", function() {
    
    describe("Status code", function() {
        it("should assert return status code", function() {
            var exists = chakram.get("http://httpbin.org/status/200");
            var missing = chakram.get("http://httpbin.org/status/404");
            return chakram.waitFor([
                expect(exists).to.have.status(200),
                expect(missing).to.have.status(404)
            ]);
        });
    });    

});