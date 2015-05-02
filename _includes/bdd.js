describe("BDD + Hooks", function () {
  var thingName;
  before("post dweet", function () {
    thingName = "chakramtest" + Math.floor(Math.random()*2000);
    return chakram.post("https://dweet.io/dweet/for/"+thingName, {
      testing: "your API"
    });
  });
  
  it("should support getting latest dweet", function () {
    var postedData = chakram.get("https://dweet.io/get/latest/dweet/for/"+thingName);
    return expect(postedData).to.have.json('with[0].content', {
      testing: "your API"
    });
  });
  
  after("update dweet with result", function () {
    return chakram.post("https://dweet.io/dweet/for/"+thingName, {
      testing: "passed"
    });
  });
});