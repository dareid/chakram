var path = require('object-path');

/**
Checks the content of a JSON object within the return body. By default this will check the body JSON exactly matches the given object. If the 'include' chain element is used, it checks that the object specified is contained within the body JSON. An additional first argument allows sub object checks.
@alias module:chakram-expectation.json
@param {String} [subelement] - if specified a subelement of the JSON body is checked, specified using dot notation 
@param {*} expectedValue - a JSON serializable object which should match the JSON body or the JSON body's subelement
@example 
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
 */

module.exports = function (chai, utils) {
    var flag = utils.flag;
    utils.addMethod(chai.Assertion.prototype, 'json', function () {
        
        var object = this._obj.body;
        var toMatch = arguments[arguments.length-1];
        
        if(arguments.length === 2) {
            object = path.get(object, arguments[0]);
            if(object === undefined || object === null) {
                throw new Error("could not find path '"+arguments[0]+"' in object "+JSON.stringify(this._obj.body)); 
            }
        }        
        
        var assert = new chai.Assertion(object);
        utils.transferFlags(this, assert, false); 
        
        if(flag(this, 'contains')) {
            assert.to.shallowDeepEqual(toMatch);
        } else {
            assert.to.deep.equal(toMatch);
        }
    });
};