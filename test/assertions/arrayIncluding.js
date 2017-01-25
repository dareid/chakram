var testsRunningInNode = (typeof global !== "undefined" ? true : false),
    chakram = (testsRunningInNode ? global.chakram : window.chakram),
    expect = (testsRunningInNode ? global.expect : window.expect);

describe("Chakram Assertions", function () {

    describe("arrayIncluding()", function () {

        it("should check array at body root", function () {
            var album = {
                "userId": 1,
                "id": 1,
                "title": "quidem molestiae enim"
            };
            var response = chakram.get("https://jsonplaceholder.typicode.com/albums");
            expect(response).to.have.arrayIncluding(album);
            return chakram.wait();
        });

        it("should check array in body", function () {
            var response = chakram.post("http://httpbin.org/post", ["an", "array"]);
            expect(response).to.have.arrayIncluding("json", "an");
            return chakram.wait();
        });

        it("should check array to not include", function () {
            var response = chakram.post("http://httpbin.org/post", ["an", "array"]);
            expect(response).to.not.have.arrayIncluding("json", "not");
            return chakram.wait();
        });
    });
});
