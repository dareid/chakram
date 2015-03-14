var tv4 = require('tv4'),
    path = require('object-path');

module.exports = function (chai, utils) {

    utils.addMethod(chai.Assertion.prototype, 'schema', function () {
        
        var object = this._obj.body;
        var schema = arguments[arguments.length-1];
        
        if(arguments.length === 2) {
            object = path.get(object, arguments[0]);
            if(object === undefined || object === null) {
                throw new Error("could not find path '"+arguments[0]+"' in object "+JSON.stringify(this._obj.body)); 
            }
        }        
        
        var valid = tv4.validate(object, schema);
        
        this.assert(
            valid, 
            'expected body to match JSON schema '+JSON.stringify(schema)+'. error: ' + tv4.error, 
            'expected body to not match JSON schema ' + JSON.stringify(schema)
        );
    });
};