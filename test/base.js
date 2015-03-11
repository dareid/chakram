var chakram = require('./../lib/chakram.js'),
    expect = chakram.expect;

describe("Chakram", function() {
    
    it("should support chai's built in expectations", function () {
        expect(true).not.to.equal(false);
        expect(1).to.be.below(10);
        expect("teststring").to.be.a('string');
        expect([1,2,3]).not.to.contain(4);
    });
    
    it("should support JSON POST requests", function (done) {
        var json = {"num": 2,"str": "test"};
        var post = chakram.post("http://httpbin.org/post", json);
        post.then(function(resp) {
            expect(resp.body.data).to.be.equal(JSON.stringify(json));
            expect(resp.body.headers['Content-Type']).to.be.equal('application/json');
            done();
        });
    });
    
    it("should support non-JSON POST requests", function (done) {
        var stringPost = "testing with a string post";
        var post = chakram.post("http://httpbin.org/post", stringPost, {json:false});
        post.then(function(resp) {
            expect(JSON.parse(resp.body).data).to.be.equal(stringPost);
            done();
        });
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
});