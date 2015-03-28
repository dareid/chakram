var chakram = require('./../lib/chakram.js'),
    expect = chakram.expect;

describe("Random User API", function() {
    var apiRequest;
    
    before(function () {
        apiRequest = chakram.get("http://api.randomuser.me/?gender=female");
    });
    
    it("should return 200 on success", function () {
        return expect(apiRequest).to.have.status(200);
    });
    
    it("should return content type and server headers", function () {
        expect(apiRequest).to.have.header("server");
        expect(apiRequest).to.have.header("content-type", /json/);
        return chakram.wait();
    });
    
    it("should include email, username, password and phone number", function () {
        return expect(apiRequest).to.have.schema('results[0].user', {
            "required": [
                "email", 
                "username", 
                "password", 
                "phone"
            ]
        });
    });
    
    it("should return a female user", function () {
        return expect(apiRequest).to.have.json('results[0].user.gender', 'female');
    });
    
    it("should return a single random user", function () {
        return expect(apiRequest).to.have.schema('results', {minItems: 1, maxItems: 1});
    }); 
    
    it("should not be gzip compressed", function () {
        return expect(apiRequest).not.to.be.encoded.with.gzip;
    });
    
    it("should return a different username on each request", function () {
        this.timeout(10000);
        var multipleRequests = [];
        for(var ct = 0; ct < 5; ct++) {
            multipleRequests.push(chakram.get("http://api.randomuser.me/?gender=female"));
        }
        return chakram.all(multipleRequests).then(function(responses) {
            var returnedUsernames = responses.map(function(response) {
                return response.body.results[0].user.username;
            });
            while (returnedUsernames.length > 0) {
                var username = returnedUsernames.pop();
                expect(returnedUsernames.indexOf(username)).to.equal(-1);
            }
        });
    });
});