module.exports = {
    get : function (chaiUtils, obj, path) {
        var subObject = chaiUtils.getPathValue(path, obj);
        if(subObject === undefined || subObject === null) {
            throw new Error("could not find path '"+path+"' in object "+JSON.stringify(obj)); 
        }
        return subObject;
    }
};