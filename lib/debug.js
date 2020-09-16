const defaultDebuggerFn = (event) => {
    console.log(event);
};

let debug = {
    isDebugging: false,
    debuggerFn: defaultDebuggerFn,
};

var exports = (module.exports = {});

const startDebug = (debuggerFn) => {
    debug.isDebugging = true;

    if (debuggerFn) {
        debug.debuggerFn = debuggerFn;
    }
};

const stopDebug = () => {
    if (debug.isDebugging) {
        debug.isDebugging = false;
        debug.debuggerFn = defaultDebuggerFn;
    }
};

/**
Deactivates debugging
@method
@alias module:chakram.stopDebug
 */
exports.stopDebug = stopDebug;
/**
Actvates debugging. By default, will print request and response details to the console.
Custom debugging functions can be specified.
@method
@param {function} debugFn - A debug function that receives the fetch event
@alias module:chakram.startDebug
 */

exports.startDebug = startDebug;
exports.debug = debug;
