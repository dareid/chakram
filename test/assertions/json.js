var testsRunningInNode = (typeof global !== "undefined" ? true : false),
    chakram = (testsRunningInNode ? global.chakram : window.chakram),
    expect = (testsRunningInNode ? global.expect : window.expect);

describe("Chakram Assertions", function() {
    describe("JSON", function() {

        var postRequest;

        before(function() {
            postRequest = chakram.post("http://httpbin.org/post", {
                stringArray: ["test1", "test2", "test3"],
                number: 20,
                str: "test str",
                empty: null,
                obj: {
                    test: "str"
                }
            });
        });

        it("should throw an error if path does not exist", function () {
            return postRequest.then(function (obj) {
                expect(function() {
                    expect(obj).to.have.json('headers.non.existant', {});
                }).to.throw(Error);
            });
        });

        it("should support checking that a path does not exist", function () {
            return expect(postRequest).not.to.have.json('headers.non.existant');
        });

        describe("Equals", function () {
            it("should ensure matches json exactly", function () {
                return chakram.waitFor([
                    expect(postRequest).to.have.json('json.stringArray', ["test1", "test2", "test3"]),
                    expect(postRequest).to.have.json('json.number', 20),
                    expect(postRequest).not.to.have.json('json.number', 22),
                    expect(postRequest).to.have.json('json.obj', {
                        test: "str"
                    })
                ]);
            });
            it("should be able to equal nulls", function () {
                return expect(postRequest).to.have.json('json.empty', null);
            });
        });

        var testChainedCompriseProperty = function(description, buildChain) {
            describe(description, function () {
                it("should ensure body includes given json", function() {
                    return chakram.waitFor([
                        buildChain(expect(postRequest).to).json({
                            json: {
                                number: 20,
                                str: "test str",
                                stringArray: {
                                    1:"test2"
                                }
                            }
                        }),
                        buildChain(expect(postRequest).to.not).json({
                            json: { number: 22 }
                        }),
                        buildChain(expect(postRequest).to).json({
                            json: {
                                obj: {
                                    test: "str"
                                }
                            }
                        })
                    ]);
                });

                it("should support negated include JSON assertions", function () {
                    return postRequest.then(function (resp) {
                        expect(function() {
                            buildChain(expect(resp).to.not).json({
                                json: { number: 20 }
                            });
                        }).to.throw(Error);
                    });
                });

                it("should be able to specify json path", function () {
                    return chakram.waitFor([
                        buildChain(expect(postRequest).to).json('json', {
                            number: 20,
                            str: "test str",
                            stringArray: {1:"test2"}
                        }),
                        buildChain(expect(postRequest).to).json('json.obj', {
                            test: "str"
                        }),
                        buildChain(expect(postRequest).to.not).json('json.obj', {
                            doesnt: "exist"
                        })
                    ]);
                });
            });
        };

        testChainedCompriseProperty("Comprise", function(assertion){ return assertion.comprise.of; });
        testChainedCompriseProperty("Comprised", function(assertion){ return assertion.be.comprised.of; });

        describe("Callbacks", function () {
            it("should allow custom callbacks to be used to run assertions", function () {
                return expect(postRequest).to.have.json('json.stringArray', function (data) {
                    expect(data).to.deep.equal(["test1", "test2", "test3"]);
                });
            });

            it("should allow the whole JSON body to be checked", function () {
                return expect(postRequest).to.have.json(function (data) {
                    expect(data.json.number).to.be.above(19).and.below(21);
                    expect(data.json.number).not.to.equal(211);
                });
            });
        });
    });
});
