var request = require('request'),
    debug = require('request-debug');

var exports = module.exports = {};

var isDebuggingOn = function () {
    return request.stopDebugging !== undefined;
};

/**
Deactivates debugging
@method
@alias module:chakram.stopDebug
 */
exports.stopDebug = function () {
    if(isDebuggingOn()) {
        request.stopDebugging();
    }
};

/**
Actvates debugging. By default, will print request and response details to the console.
Custom debugging functions can be specified.
@method
@param {function} debugFn - A debug function which replaces the default log to console. Details of parameters can be found at https://github.com/request/request-debug.
@alias module:chakram.startDebug
 */
exports.startDebug = function (debugFn) {
    exports.stopDebug();
    debug(request, debugFn);
};
