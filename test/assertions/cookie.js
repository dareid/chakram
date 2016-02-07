var testsRunningInNode = (typeof global !== "undefined" ? true : false),
    chakram = (testsRunningInNode ? global.chakram : window.chakram),
    expect = (testsRunningInNode ? global.expect : window.expect);

describe("Chakram Assertions", function() {
    describe("Cookies", function() {

        var cookieSet;

        before(function() {
            cookieSet = chakram.get("http://httpbin.org/cookies/set?chakram=testval");
        });

        it("should check existance of a cookie", function () {
            expect(cookieSet).to.have.cookie('chakram');
            expect(cookieSet).not.to.have.cookie('nonexistantcookie');
            return chakram.wait();
        });

        it("should check that the cookie value matches a given string", function () {
            expect(cookieSet).to.have.cookie('chakram', 'testval');

            expect(cookieSet).not.to.have.cookie('Chakram', 'testval');
            expect(cookieSet).not.to.have.cookie('chakram', 'est');
            expect(cookieSet).not.to.have.cookie('chakram', 'testva');
            expect(cookieSet).not.to.have.cookie('chakram', 'Testval');
            expect(cookieSet).not.to.have.cookie('chakram', '');

            expect(cookieSet).not.to.have.cookie('nonexistantcookie', 'testval');
            return chakram.wait();
        });

        it("should check that the cookie value satisifies regex", function () {
            expect(cookieSet).to.have.cookie('chakram', /testval/);
            expect(cookieSet).to.have.cookie('chakram', /TESTVAL/i);
            expect(cookieSet).to.have.cookie('chakram', /test.*/);
            expect(cookieSet).to.have.cookie('chakram', /te.*val/);
            expect(cookieSet).to.have.cookie('chakram', /est/);

            expect(cookieSet).not.to.have.cookie('chakram', /\s/);
            expect(cookieSet).not.to.have.cookie('chakram', /t[s]/);
            expect(cookieSet).not.to.have.cookie('chakram', /TESTVAL/);

            expect(cookieSet).not.to.have.cookie('nonexistantcookie', /testval/);
            return chakram.wait();
        });
    });

    describe("Cookies internal state", function() {

        var cookieSet;

        it("should preserve cookies if defaults jar set to true", function() {
            chakram.setRequestDefaults({jar: true});

            cookieSet = chakram.get("http://httpbin.org/cookies/set?chakram1=testval1");
            cookieSet = chakram.get("http://httpbin.org/cookies/set?chakram2=testval2");

            expect(cookieSet).to.have.cookie('chakram1', 'testval1');
            expect(cookieSet).to.have.cookie('chakram2', 'testval2');
            return chakram.wait();
        });

        it("should not preserve cookies between requests on default", function() {

            // Reset to default state
            chakram.setRequestDefaults({jar: undefined});

            cookieSet = chakram.get("http://httpbin.org/cookies/set?chakram1=testval1");
            expect(cookieSet).to.have.cookie('chakram1', 'testval1');

            cookieSet = chakram.get("http://httpbin.org/cookies/set?chakram2=testval2");
            expect(cookieSet).not.to.have.cookie('chakram1', 'testval1');
            expect(cookieSet).to.have.cookie('chakram2', 'testval2');
            return chakram.wait();
        });

        testsRunningInNode && it("should preserve cookies if defaults jar set to instance", function() {
            var request = require('request');
            var jar = request.jar();
            chakram.setRequestDefaults({jar: jar});

            cookieSet = chakram.get("http://httpbin.org/cookies/set?chakram1=testval1");
            cookieSet = chakram.get("http://httpbin.org/cookies/set?chakram2=testval2");

            expect(cookieSet).to.have.cookie('chakram1', 'testval1');
            expect(cookieSet).to.have.cookie('chakram2', 'testval2');
            return chakram.wait();
        });


    });
});
