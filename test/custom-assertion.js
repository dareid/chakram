var chakram = require('./../lib/chakram.js'),
    expect = chakram.expect;

describe("Custom Assertion", function() {

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
            expect(notATeapot).to.not.be.a.teapot,
            expect(aTeapot).to.be.a.teapot
        ]);
    });
    
    it("should support adding custom methods", function () {
        var aTeapot = chakram.get("http://httpbin.org/status/418");
        return expect(aTeapot).to.have.httpVersion("1.1");
    });
    
});