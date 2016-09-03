var testsRunningInNode = (typeof global !== "undefined" ? true : false),
    chakram = (testsRunningInNode ? global.chakram : window.chakram),
    expect = (testsRunningInNode ? global.expect : window.expect);

describe("Chakram Assertions", function() {

    describe("Response Time", function() {

        var request;
        before(function () {
            request = chakram.get("http://httpbin.org/delay/2");
        })

        it("should check response time is less than or equal to expected response time", function () {
            expect(request).to.have.responsetime(3000);
            expect(request).not.to.have.responsetime(1900);
            return chakram.wait();
        })
    });
});
