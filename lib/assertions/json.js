var path = require('./../utils/objectPath.js');

/**
Checks the content of a JSON object within the return body. By default this will check the body JSON exactly matches the given object. If the 'comprise' chain element is used, it checks that the object specified is contained within the body JSON. An additional first argument allows sub object checks.
@alias module:chakram-expectation.json
@param {String} [subelement] - if specified a subelement of the JSON body is checked, specified using dot notation 
@param {*|function} expectedValue - a JSON serializable object which should match the JSON body or the JSON body's subelement OR a custom function which is called with the JSON body or the JSON body's subelement
@example 
it("should allow checking of JSON return bodies", function () {
    var response = chakram.get("http://httpbin.org/get");
    expect(response).to.comprise.of.json({
        url: "http://httpbin.org/get",
        headers: {
            Host: "httpbin.org",
        }
    });
    expect(response).to.have.json('url', "http://httpbin.org/get");
    expect(response).to.have.json('url', function (url) {
        expect(url).to.equal("http://httpbin.org/get");
    });
    return chakram.wait();
});
 */

module.exports = function (chai, utils) {
    var flag = utils.flag;
    utils.addMethod(chai.Assertion.prototype, 'json', function () {
        
        var object = this._obj.body;
        var toMatch = arguments[arguments.length-1];
        
        if(arguments.length === 2) {
            object = path.get(utils, object, arguments[0]);
        }        
        
        if(typeof(toMatch) === 'function') {
            toMatch(object);
        } else {
            var assert = new chai.Assertion(object);
            utils.transferFlags(this, assert, false); 

            if(flag(this, 'contains')) {
                assert.to.containSubset(toMatch);
            } else {
                assert.to.deep.equal(toMatch);
            }
        }
    });
};