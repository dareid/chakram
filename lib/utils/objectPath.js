var pathLib = require('object-path');

module.exports = {
    get : function (obj, path) {
        var subObject = pathLib.get(obj, path);
        if(subObject === undefined || subObject === null) {
            throw new Error("could not find path '"+path+"' in object "+JSON.stringify(obj)); 
        }
        return subObject;
    }
};