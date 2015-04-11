var chakram = require('./../../lib/chakram.js'),
    expect = chakram.expect;

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
});