var chakram = require('./../lib/chakram.js'),
    expect = chakram.expect;

describe("Documentation examples", function() {
  
    it("should support chakram and chai expectations", function () {
        var chakramRequest = chakram.get("http://google.com");
        expect(true).to.be.true;
        expect(chakramRequest).to.have.status(200);
        expect(1).to.be.below(10);
        expect("teststring").to.be.a('string');
        return chakram.wait();
    });  
  
    it("should support grouping multiple tests", function () {
        var request = chakram.get("http://httpbin.org/get");
        return chakram.waitFor([
            expect(request).to.have.status(200),
            expect(request).not.to.have.status(404)
        ]);
    });
  
    it("should support auto waiting for tests", function() {
        var request = chakram.get("http://httpbin.org/get");
        expect(request).to.have.status(200);
        expect(request).not.to.have.status(404);
        return chakram.wait();
    });
  
    it("should allow checking of HTTP cookies", function () {
        var request = chakram.get("http://httpbin.org/cookies/set?chakram=testval");
        return chakram.waitFor([
            expect(request).to.have.cookie('chakram'),
            expect(request).to.have.cookie('chakram', 'testval'),
            expect(request).to.have.cookie('chakram', /val/)
        ]);
    });
  
    it("should allow checking of HTTP headers", function () {
        var request = chakram.get("http://httpbin.org/get");
        return chakram.waitFor([
            expect(request).to.have.header('content-type'),
            expect(request).to.have.header('content-type', 'application/json'),
            expect(request).to.have.header('content-type', /json/)
        ]);
    });

    it("should allow checking of JSON return bodies", function () {
        var request = chakram.get("http://httpbin.org/get");
        expect(request).to.include.json({
            url: "http://httpbin.org/get",
            headers: {
                Host: "httpbin.org",
            }
        });
        expect(request).to.have.json('url', "http://httpbin.org/get");
        return chakram.wait();
    });

    it("should allow checking of the response's status code", function () {
        var request = chakram.get("http://httpbin.org/get");
        return expect(request).to.have.status(200);
    });
  
    it("should check that the returned JSON object satisifies a JSON schema", function () {
        var request = chakram.get("http://httpbin.org/get");
        expect(request).to.have.schema('headers', {"required": ["Host", "Accept"]});
        expect(request).to.have.schema({
            "type": "object",
            properties: {
                url: {
                    type: "string"
                },
                headers: {
                    type: "object"
                }
            }
        });
        return chakram.wait();
    });
  
    it("should detect deflate compression", function () {
        var deflate = chakram.get("http://httpbin.org/deflate");
        return expect(deflate).to.be.encoded.with.deflate;
    });
    
    it("should detect gzip compression", function () {
        var gzip = chakram.get("http://httpbin.org/gzip");
        return expect(gzip).to.be.encoded.with.gzip;
    });
    
});