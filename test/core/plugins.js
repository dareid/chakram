var testsRunningInNode = (typeof global !== "undefined" ? true : false),
    chakram = (testsRunningInNode ? global.chakram : window.chakram),
    expect = (testsRunningInNode ? global.expect : window.expect);

describe("Plugins", function() {

    it("should allow new properties to be defined", function () {
        chakram.addProperty("httpbin", function (respObj) {
            var hostMatches = /httpbin.org/.test(respObj.url);
            this.assert(hostMatches, 'expected '+respObj.url+' to contain httpbin.org', 'expected '+respObj.url+' to not contain httpbin.org');
        });
        var httpbin = chakram.get("http://httpbin.org/status/200");
        expect(httpbin).to.be.at.httpbin;
        var senseye = chakram.get("http://senseye.io");
        expect(senseye).not.to.be.at.httpbin;
        return chakram.wait();
    });

    it("should allow new methods to be defined", function () {
        chakram.addMethod("statusRange", function (respObj, low, high) {
            var inRange = respObj.response.statusCode >= low && respObj.response.statusCode <= high;
            this.assert(inRange, 'expected '+respObj.response.statusCode+' to be between '+low+' and '+high, 'expected '+respObj.response.statusCode+' not to be between '+low+' and '+high);
        });
        var twohundred = chakram.get("http://httpbin.org/status/200");
        expect(twohundred).to.have.statusRange(0, 200);
        expect(twohundred).to.have.statusRange(200, 200);
        expect(twohundred).not.to.have.statusRange(300, 500);
        return chakram.wait();
    });


    describe("raw chai plugin registration", function () {
        before(function() {
            chakram.addRawPlugin("unavailable", function (chai, utils) {
                utils.addProperty(chai.Assertion.prototype, 'unavailable', function () {
                    var statusCode = this._obj.response.statusCode;
                    this.assert(statusCode === 503, 'expected status code '+statusCode+' to equal 503', 'expected '+statusCode+' to not be equal to 503');
                });
            });
        });
        it("should allow low level chai plugins to be registered", function() {
            var unavailableReq = chakram.get("http://httpbin.org/status/503");
            return expect(unavailableReq).to.be.unavailable;
        });
    });


    describe("pre 0.2.0 plugin registration", function () {
        before(function() {
            var customProperty = function (chai, utils) {
                utils.addProperty(chai.Assertion.prototype, 'teapot', function () {
                    var statusCode = this._obj.response.statusCode;
                    this.assert(statusCode === 418, 'expected status code '+statusCode+' to equal 418', 'expected '+statusCode+' to not be equal to 418');
                });
            };
            var customMethod = function (chai, utils) {
                utils.addMethod(chai.Assertion.prototype, 'httpVersion', function (ver) {
                    var version = this._obj.response.httpVersion;
                    this.assert(version === ver, 'expected '+version+' to equal #{exp}', 'expected '+version+' to not be equal to #{exp}', ver);
                });
            };
            chakram.initialize(customProperty, customMethod);
        });

        it("should support adding custom properties", function () {
            var notATeapot = chakram.get("http://httpbin.org/status/200");
            var aTeapot = chakram.get("http://httpbin.org/status/418");
            return chakram.waitFor([
                expect(notATeapot).to.not.be.teapot,
                expect(aTeapot).to.be.teapot
            ]);
        });

        it("should support adding custom methods", function () {
            var aTeapot = chakram.get("http://httpbin.org/status/418");
            return expect(aTeapot).to.have.httpVersion("1.1");
        });
    });

});
