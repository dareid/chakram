var path = require('object-path');

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