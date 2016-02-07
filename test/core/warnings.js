var testsRunningInNode = (typeof global !== "undefined" ? true : false);

testsRunningInNode && describe("User Warnings", function() {

    var rewire = require('rewire'),
        sinon = require('sinon'),
        chakram = rewire('./../../lib/chakram.js'),
        expect = chakram.expect;

    var warningStub, revertWarning;

    before(function () {
        warningStub = sinon.stub();
        revertWarning = chakram.__set__("warnUser", warningStub);
    });

    it("should warn user about unrun tests", function () {
        var request = chakram.get("http://httpbin.org/status/200");
        expect(request).to.have.status(400);
        return request;
    });

    it("should warn user about unrun tests even when 'it' is synchronous", function() {
        var request = chakram.get("http://httpbin.org/status/200");
        expect(request).to.have.status(400);
    });

    it("should set the test as an error on warning the user", function () {
        revertWarning();
        var thisObj = {
            test: {
                error : sinon.stub()
            },
            currentTest: {
                state : "passed"
            }
        };
        var warning = chakram.__get__("warnUser");
        warning.call(thisObj, "test error");
        expect(thisObj.test.error.callCount).to.equal(1);
    });

    it("should not warn the user if the test has failed anyway", function () {
        revertWarning();
        var thisObj = {
            test: {
                error : sinon.stub()
            },
            currentTest: {
                state : "failed"
            }
        };
        var warning = chakram.__get__("warnUser");
        warning.call(thisObj, "test error");
        expect(thisObj.test.error.callCount).to.equal(0);
    });

    after(function() {
        expect(warningStub.callCount).to.equal(2);
    });
});
