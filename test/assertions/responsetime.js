var testsRunningInNode = (typeof global !== "undefined" ? true : false),
    chakram = (testsRunningInNode ? global.chakram : window.chakram),
    expect = (testsRunningInNode ? global.expect : window.expect);

describe("Chakram Assertions", function() {

    describe("Response Time", function() {

        var request;
        before(function () {
            request = chakram.get("http://httpbin.org/delay/2");
        })

        it("should check response time is less than or equal to expected response time if called as a method", function () {
            return expect(request).to.have.responsetime(3000);
        })

        it("should support chaining", function() {
            return chakram.waitFor([
                expect(request).to.have.responsetime.below(3000),
                expect(request).to.have.responsetime.above(2000),
                expect(request).to.have.responsetime.within(2000, 3000)
            ]);
        });
    });
});
