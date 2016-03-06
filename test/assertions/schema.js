var testsRunningInNode = (typeof global !== "undefined" ? true : false),
    chakram = (testsRunningInNode ? global.chakram : window.chakram),
    expect = (testsRunningInNode ? global.expect : window.expect);

describe("Chakram Assertions", function() {
    describe("JSON Schema", function() {

        var getRequest, postRequest, personArraySchema;

        before(function() {
            getRequest = chakram.get("http://httpbin.org/get");
            postRequest = chakram.post("http://httpbin.org/post", {
                stringArray: ["test1", "test2", "test3"],
                mixedArray: ["str", true, 20, 1.2222, true],
                objectArray: [{
                    name: "bob",
                    age: 20
                }, {
                    name: "jim",
                    age: 72
                }],
                number: 20,
                str: "test str"
            });

            personArraySchema = {
                items: {
                    properties: {
                        name: { type: "string" },
                        age: {
                            type: "integer",
                            minimum: 0
                        }
                    }
                }
            };
        });

        describe("dot notation access", function() {

            it("should perform assertions on subelements if first argument is a dot notation string", function () {
                var expectedSchema = {"required": ["Host", "Accept"]};
                expect(getRequest).to.have.schema('headers', expectedSchema);
                expect(getRequest).not.to.have.schema(expectedSchema);
                return chakram.wait();
            });

            it("should thrown an error if dot notation is not valid", function () {
                return getRequest.then(function (obj) {
                    expect(function() {
                        expect(obj).to.have.schema('headers.non.existant', {});
                    }).to.throw(Error);
                });
            });

            it("should be case sensitive", function () {
                return getRequest.then(function (obj) {
                    expect(function() {
                        expect(obj).to.have.schema('Headers', {});
                    }).to.throw(Error);
                });
            });

        });

        describe("objects", function () {

            it("should be able to specify required object values", function () {
                var expectedSchema = {"required": ["args", "headers", "origin"]};
                var incorrectSchema = {"required": ["not", "existing"]};
                return chakram.waitFor([
                    expect(getRequest).to.have.schema(expectedSchema),
                    expect(getRequest).not.to.have.schema(incorrectSchema)
                ]);
            });

            it("should allow exact matching of an object's properties", function () {
                var missingUrlSchema = {
                    properties: {
                        url: {},
                        headers: {},
                        origin: {},
                        args: {}
                    },
                    additionalProperties: false
                };
                return expect(getRequest).to.have.schema(missingUrlSchema);
            });

            it("should assert types in json object", function () {
                var expectedTypes = {
                    "type": "object",
                    properties: {
                        url: {
                            type: "string"
                        },
                        headers: {
                            type: "object"
                        }
                    }
                };
                return expect(getRequest).to.have.schema(expectedTypes);
            });

            it("should allow assertions on object's properties", function () {
                var expectedTypes = {
                    properties: {
                        url: {
                            type: "string"
                        }
                    }
                };
                return expect(getRequest).to.have.schema(expectedTypes);
            });

        });

        describe("arrays", function () {

            it("should assert types in json arrays", function () {
                var mixedArray = {
                    items: {
                        type: ["string", "boolean", "number"]
                    }
                };
                var stringArray = {
                    items: {
                        type: "string"
                    }
                };
                return chakram.waitFor([
                    expect(postRequest).to.have.schema('json.stringArray', stringArray),
                    expect(postRequest).to.have.schema('json.stringArray', mixedArray),
                    expect(postRequest).not.to.have.schema('json.mixedArray', stringArray),
                    expect(postRequest).to.have.schema('json.mixedArray', mixedArray)
                ]);
            });

            it("should allow assertions on array's items", function () {
                var expectStringsToBeTestWithNumber = {
                    items: {
                        pattern: /test\d/
                    }
                };
                return chakram.waitFor([
                    expect(postRequest).to.have.schema('json.stringArray', expectStringsToBeTestWithNumber),
                    expect(postRequest).not.to.have.schema('json.mixedArray', expectStringsToBeTestWithNumber),
                    expect(postRequest).to.have.schema('json.objectArray', personArraySchema)
                ]);
            });

            it("should assert array length", function () {
                expect(postRequest).to.have.schema('json.stringArray', {minItems: 0, maxItems: 5});
                expect(postRequest).to.have.schema('json.stringArray', {maxItems: 5});
                expect(postRequest).to.have.schema('json.stringArray', {minItems: 3, maxItems: 5});
                expect(postRequest).not.to.have.schema('json.stringArray', {minItems: 4, maxItems: 5});
                expect(postRequest).not.to.have.schema('json.stringArray', {minItems: 1, maxItems: 2});
                return chakram.wait();
            });

            it("should assert unique items in array", function () {
                expect(postRequest).to.have.schema('json.stringArray', {uniqueItems:true});
                expect(postRequest).to.have.schema('json.mixedArray', {uniqueItems:false});
                expect(postRequest).not.to.have.schema('json.mixedArray', {uniqueItems:true});
                return chakram.wait();
            });

        });

        describe("numbers", function() {

            it("should assert number min and max values", function () {
                expect(postRequest).to.have.schema('json.number', {minimum:0, maximum:100});
                expect(postRequest).to.have.schema('json.number', {maximum:100});
                expect(postRequest).to.have.schema('json.number', {minimum:19, maximum:21});
                expect(postRequest).to.have.schema('json.number', {minimum:20, maximum:21});
                expect(postRequest).not.to.have.schema('json.number', {minimum:20, maximum:21, exclusiveMinimum:true});
                expect(postRequest).to.have.schema('json.number', {minimum:19, maximum:20});
                expect(postRequest).not.to.have.schema('json.number', {minimum:19, maximum:20, exclusiveMaximum:true});
                expect(postRequest).not.to.have.schema('json.number', {minimum:1, maximum:5});
                return chakram.wait();
            });

        });

        describe("strings", function() {

            it("should assert string matches regex", function () {
                expect(postRequest).to.have.schema('json.str', {pattern: /test/});
                expect(postRequest).to.have.schema('json.str', {pattern: /str/});
                expect(postRequest).to.have.schema('json.str', {pattern: /est\sst/});
                expect(postRequest).not.to.have.schema('json.str', {pattern: /string/});
                expect(postRequest).not.to.have.schema('json.str', {pattern: /\d/});
                return chakram.wait();
            });

            it("should assert string length", function () {
                expect(postRequest).to.have.schema('json.str', {minLength: 0, maxLength: 100});
                expect(postRequest).not.to.have.schema('json.str', {maxLength: 5});
                expect(postRequest).not.to.have.schema('json.str', {minLength: 50});
                return chakram.wait();
            });

        });

        describe("registering schemas", function () {

            it("should be able to validate pre-registered schemas", function () {
                chakram.addSchema("https://github.com/dareid/chakram/testschema/person-array", personArraySchema);
                chakram.addSchema({
                    id: "https://github.com/dareid/chakram/testschema/string-array",
                    pattern: /test\d/
                });
                return expect(postRequest).to.have.schema('json', {
                    properties: {
                        stringArray: {
                            items: {
                                $ref: "https://github.com/dareid/chakram/testschema/string-array"
                            }
                        },
                        objectArray: {
                            $ref: "https://github.com/dareid/chakram/testschema/person-array"
                        }
                    }
                });
            });

            it("should fail assertions with unknown schemas", function () {
                return expect(postRequest).not.to.have.schema('json', {
                    id: "https://github.com/dareid/chakram/testschema2",
                    properties: {
                        objectArray: {
                            $ref: "https://github.com/dareid/chakram/testschema/person-array-not-registered#"
                        }
                    }
                });
            });

        });

    });
});
