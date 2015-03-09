var chakram = require('./../lib/chakram.js'),
    expect = chakram.expect;

var customProperty = function (chai, utils) {
    utils.addProperty(chai.Assertion.prototype, 'teapot', function () {
        this.assert(this._obj.response.statusCode === 418, 'expected status code #{this} to equal #{exp}', 'expected #{this} to not be equal to #{exp}', 418);
    });
};
var customMethod = function (chai, utils) {
    utils.addMethod(chai.Assertion.prototype, 'httpVersion', function (ver) {
        this.assert(this._obj.response.httpVersion === ver, 'expected #{this} to equal #{exp}', 'expected #{this} to not be equal to #{exp}', ver);
    });
};

chakram.initialize(customProperty, customMethod);

describe("Custom Matchers", function() {

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