var url = require('url');

var exports = module.exports = {};

var responses = {};

exports.record = function (respObj) {
    var parsedUrl = url.parse(respObj.url);
    
    if (responses[parsedUrl.host] === undefined) {
        responses[parsedUrl.host] = {};
    }
    var hostStorage = responses[parsedUrl.host];
    
    if (hostStorage[parsedUrl.pathname] === undefined) {
        hostStorage[parsedUrl.pathname] = [];
    }
    var pathStorage = hostStorage[parsedUrl.pathname];
    
    pathStorage.push(respObj);
};

after(function () {
});