module.exports = function (chai, utils) {

    utils.addMethod(chai.Assertion.prototype, 'status', function (status) {
        var respStatus = this._obj.response.statusCode;
        this.assert(
            respStatus === status, 
            'expected status code ' + respStatus + ' to equal ' + status, 
            'expected status code ' + respStatus + ' not to equal ' + status
        );
    });
};