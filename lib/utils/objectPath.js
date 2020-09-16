const { get } = require("lodash");

module.exports = {
    get: function (chaiUtils, obj, path) {
        var subObject = get(obj, path);
        if (subObject === undefined) {
            throw new Error("could not find path '" + path + "' in object " + JSON.stringify(obj));
        }
        return subObject;
    },
};
