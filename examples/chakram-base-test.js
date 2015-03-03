var chakram = require('./../lib/chakram.js'),
    expect = chakram.expect;

describe("Chakram", function() {
    
    describe("Async support", function () {
        var delayedResponse;
        this.timeout(10000);
        
        beforeEach(function() {
            delayedResponse = chakram.get("http://httpbin.org/delay/1");
        });
    
        it("should support mocha's promise returns", function () {
            return expect(delayedResponse).to.have.status(200);
        });

        it("should support mocha's done callback", function (done) {
            expect(delayedResponse).to.have.status(200).and.notify(done);
        });
    });
    
    describe("Multiple expects", function () {
        var request;
        
        beforeEach(function() {
            request = chakram.get("http://httpbin.org/status/200");
        });
        
        it("should support grouping multiple tests", function () {
            return chakram.all([
                expect(request).to.have.status(200),
                expect(request).not.to.have.status(404)
            ]);
        });
        
        it("should support chaining of tests", function () {
            return expect(request).to.have.status(200).and.not.to.have.status(404);
        });
    });
});