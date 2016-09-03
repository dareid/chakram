var testsRunningInNode = (typeof global !== "undefined" ? true : false),
    chakram = (testsRunningInNode ? global.chakram : window.chakram),
    expect = (testsRunningInNode ? global.expect : window.expect);

describe("Methods", function() {

    var testWriteMethods = function (testMethod, testUrl) {
        it("should support JSON requests", function () {
            var json = {"num": 2,"str": "test"};
            var response = testMethod(testUrl, json);
            return response.then(function(resp) {
                expect(resp.body).to.be.an('object');
                expect(resp.body.json).to.deep.equal(json);
                expect(resp.body.headers['Content-Type']).to.be.equal('application/json');
            });
        });

        it("should support non-JSON requests", function () {
            var stringPost = "testing with a string post";
            var response = testMethod(testUrl, stringPost, {json:false});
            return response.then(function(resp) {
                expect(resp.body).to.be.a('string');
                expect(JSON.parse(resp.body).data).to.be.equal(stringPost);
                expect(JSON.parse(resp.body).headers['Content-Type']).not.to.be.equal('application/json');
            });
        });

        it("should support sending custom headers", function () {
            var customHeaders = {
                "Token": "dummy token value"
            };
            var response = testMethod(testUrl, {}, {
                headers: customHeaders
            });
            return expect(response).to.include.json('headers', customHeaders);
        });
    };

    describe("POST", function () {
        testWriteMethods(chakram.post, "http://httpbin.org/post");

		testsRunningInNode && it("should allow posting files with multipart/form-data", function () {
            var fs = require('fs');
			var response = chakram.post("https://httpbin.org/post", undefined, {
				formData: {
					pkgFile: fs.createReadStream('./package.json')
				}
			});
			expect(response).to.have.json('files', function (files) {
				expect(files).to.have.key('pkgFile');
				expect(files.pkgFile).to.contain('chakram');
			});
			return chakram.wait();
		});
    });

    describe("PUT", function () {
        testWriteMethods(chakram.put, "http://httpbin.org/put");
    });

    describe("DELETE", function () {
        testWriteMethods(chakram.delete, "http://httpbin.org/delete");
        testWriteMethods(chakram.del, "http://httpbin.org/delete");
    });

    describe("PATCH", function () {
        testWriteMethods(chakram.patch, "http://httpbin.org/patch");
    });

    it("should allow GET requests", function () {
        return chakram.get("http://httpbin.org/get?test=str")
        .then(function(obj) {
            expect(obj.body).to.be.an('object');
            expect(obj.body.args.test).to.equal('str');
        });
    });

    it("should allow HEAD requests", function () {
        var request = chakram.head("http://httpbin.org/get?test=str");
        expect(request).to.have.status(200);
        expect(request).to.have.header('content-length');
        return chakram.wait().then(function(obj) {
            expect(obj.body).to.be.undefined;
        });
    });

    it("should allow OPTIONS requests", function () {
        var request = chakram.options("http://httpbin.org/get?test=str");
        expect(request).to.have.header('Access-Control-Allow-Credentials');
        expect(request).to.have.header('Access-Control-Allow-Methods');
        expect(request).to.have.header('Access-Control-Allow-Origin');
        expect(request).to.have.header('Access-Control-Max-Age');
        return chakram.wait();
    });

  describe("request defaults", function () {
      before(function () {
          chakram.setRequestDefaults({
              headers: {
                  Testing: 'default-option'
              }
          });
      });

      it("should allow default settings to be applied to multiple requests", function () {
          return chakram.get("http://httpbin.org/get").then(function(firstResp) {
              return chakram.get("http://httpbin.org/get").then(function (secondResp) {
                  expect(firstResp.body.headers.Testing).to.equal('default-option');
                  expect(secondResp.body.headers.Testing).to.equal('default-option');
              });
          });
      });

      it("should allow clearing default settings", function () {
          chakram.clearRequestDefaults();
          return chakram.get("http://httpbin.org/get").then(function(resp) {
              expect(resp.body.headers.Testing).to.be.undefined;
          });
      });
  });
});
