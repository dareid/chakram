var testsRunningInNode = (typeof global !== "undefined" ? true : false),
    chakram = (testsRunningInNode ? global.chakram : window.chakram),
    expect = (testsRunningInNode ? global.expect : window.expect);

describe("Chakram", function() {

    it("should support chai's built in expectations", function () {
        expect(true).not.to.equal(false);
        expect(1).to.be.below(10);
        expect("teststring").to.be.a('string');
        expect([1,2,3]).not.to.contain(4);
        expect(undefined).to.be.undefined;
        expect(null).to.be.null;
    });

    describe("Async support", function () {

        describe("Async it", function() {
            var delayedResponse;
            this.timeout(11000);

            beforeEach(function() {
                delayedResponse = chakram.get("http://httpbin.org/delay/1");
            });

            it("should support mocha's promise returns", function () {
                return expect(delayedResponse).to.have.status(200);
            });

            it("should support mocha's done callback", function (done) {
                expect(delayedResponse).to.have.status(200).then(function(){done();});
            });
        });
    });


    describe("Response Object", function () {

        var request;

        before(function () {
            request = chakram.get("http://httpbin.org/get");
        });

        it("should expose any errors in the chakram response object", function () {
            return chakram.get("not-valid")
            .then(function(obj) {
                expect(obj.error).to.exist.and.to.be.an("error");
            });
        });

        it("should include the original URL in the chakram response object", function () {
            return chakram.get("not-valid")
            .then(function(obj) {
                expect(obj.url).to.exist.and.to.equal("not-valid");
            });
        });

        var assertChakramResponseObject = function (obj) {
            expect(obj.body).to.exist;
            expect(obj.response).to.exist;
            expect(obj.error).to.be.null;
            expect(obj.url).to.exist;
            expect(obj.jar).to.exist;
        };

        it("should resolve chakram request promises to a chakram response object", function () {
            return request.then(assertChakramResponseObject);
        });

        it("should resolve chakram expect promises to a chakram response object", function () {
            var expectPromise = expect(request).to.have.status(200);
            return expectPromise.then(assertChakramResponseObject);
        });

        it("should resolve chakram.waitFor promises to a chakram response object", function () {
            var waitPromise = chakram.waitFor([
                expect(request).to.have.status(200),
                expect(request).not.to.have.status(400)
            ]);
            return waitPromise.then(assertChakramResponseObject);
        });

        it("should resolve chakram.wait promises to a chakram response object", function () {
            expect(request).to.have.status(200);
            expect(request).not.to.have.status(400);
            return chakram.wait().then(assertChakramResponseObject);
        });

        it("should record response time", function () {
            this.timeout(3000);
            return chakram.get("http://httpbin.org/delay/2")
            .then(function (obj) {
                expect(obj.responseTime).to.exist.and.to.be.at.least(2000).and.at.most(3000);
            });
        });
    });

    describe("Multiple expects", function () {
        var request;

        beforeEach(function() {
            request = chakram.get("http://httpbin.org/status/200");
        });

        it("should support grouping multiple tests", function () {
            return chakram.waitFor([
                expect(request).to.have.status(200),
                expect(request).not.to.have.status(404)
            ]);
        });

        it("should support chaining of tests", function () {
            return expect(request).to.have.status(200).and.not.to.have.status(404);
        });

        it("should support auto waiting for tests", function() {
            expect(request).to.have.status(200);
            expect(request).not.to.have.status(404);
            return chakram.wait();
        });
    });

    describe("Chained requests", function () {
        it("should allow multiple chained requests", function () {
            this.timeout(4000);
            return expect(chakram.get("http://httpbin.org/status/200")).to.have.status(200)
            .then(function(obj) {
                var postRequest = chakram.post("http://httpbin.org/post", {"url": obj.url});
                expect(postRequest).to.have.status(200);
                expect(postRequest).to.have.header('content-length');
                return chakram.wait();
            }).then(function(obj) {
                expect(obj.body.json.url).to.be.equal("http://httpbin.org/status/200");
            });
        });
    });
});
