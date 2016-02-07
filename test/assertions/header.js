var testsRunningInNode = (typeof global !== "undefined" ? true : false),
    chakram = (testsRunningInNode ? global.chakram : window.chakram),
    expect = (testsRunningInNode ? global.expect : window.expect);

describe("Chakram Assertions", function() {
    describe("Header", function() {

        var headerRequest;

        before(function() {
            headerRequest = chakram.get("http://httpbin.org/response-headers?testheader=true123");
        });

        it("should check existance of a header", function () {
            expect(headerRequest).to.have.header('testheader');
            expect(headerRequest).to.have.header('testHeaDer');
            expect(headerRequest).not.to.have.header('notpresentheader');
            return chakram.wait();
        });

        it("should check that header matches string", function () {
            expect(headerRequest).to.have.header('testheader', "true123");
            expect(headerRequest).to.have.header('TESTHEADER', "true123");

            expect(headerRequest).not.to.have.header('testheader', "123");
            expect(headerRequest).not.to.have.header('testheader', "TRUE");
            expect(headerRequest).not.to.have.header('testheader', "true");
            expect(headerRequest).not.to.have.header('testheader', "tru");

            expect(headerRequest).not.to.have.header('notpresentheader', "true123");
            return chakram.wait();
        });

        it("should check that header satisfies regex", function () {
            expect(headerRequest).to.have.header('testheader', /true/);
            expect(headerRequest).to.have.header('testheader', /ru/);
            expect(headerRequest).to.have.header('testheader', /\d/);
            expect(headerRequest).to.have.header('testheader', /[t][r]/);
            expect(headerRequest).to.have.header('Testheader', /TRUE/i);

            expect(headerRequest).not.to.have.header('testheader', /tree/);
            expect(headerRequest).not.to.have.header('testheader', /\s/);
            expect(headerRequest).not.to.have.header('testheader', /[t][w|y|j]/);
            expect(headerRequest).not.to.have.header('testheader', /TRUE/);

            expect(headerRequest).not.to.have.header('notpresentheader', "/true123/");
            return chakram.wait();
        });

        it("should call provided functions with the header value", function () {
            expect(headerRequest).to.have.header('testheader', function (headerValue) {
                expect(headerValue).to.equal("true123");
            });
            expect(headerRequest).to.have.header('notpresentheader', function (headerValue) {
                expect(headerValue).to.be.undefined;
            });
            return chakram.wait();
        });
    });
});
