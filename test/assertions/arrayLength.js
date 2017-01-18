var testsRunningInNode = (typeof global !== "undefined" ? true : false),
    chakram = (testsRunningInNode ? global.chakram : window.chakram),
    expect = (testsRunningInNode ? global.expect : window.expect);

describe("Chakram Assertions", function () {

    describe("arrayLength()", function () {

        it("should check length of array at root", function () {
            var response = chakram.post("http://httpbin.org/post", ["an", "array"]);
            expect(response).to.have.arrayLength(2);
            return chakram.wait();
        });

        it("should check length of array in body", function () {
            var response = chakram.post("http://httpbin.org/post", {myArr: ["an", "array"]});
            expect(response).to.have.arrayLength("myArr", 2);
            return chakram.wait();
        });
    });
});
