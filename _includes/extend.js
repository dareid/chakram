describe("Extensibility", function () {
  before("define teapot", function () {
    chakram.addProperty("teapot", function (respObj) {
      var statusCode = respObj.response.statusCode;
      this.assert(statusCode === 418,
        'expected status code ' + statusCode + ' to equal 418',
        'expected ' + statusCode + ' to not be equal to 418');
    });
  });

  it("should be able to detect teapots", function () {
    var notATeapot = chakram.get("http://httpbin.org/status/200");
    var aTeapot = chakram.get("http://httpbin.org/status/418");
    expect(notATeapot).to.not.be.a.teapot;
    expect(aTeapot).to.be.a.teapot;
    return chakram.wait();
  });
});