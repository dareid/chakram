module.exports = function (chai, utils) {

    utils.addMethod(chai.Assertion.prototype, 'status', function (status) {
        this.assert(
            this._obj.response.statusCode == status
            , 'expected status code #{this} to equal #{exp}'
            , 'expected #{this} to not be equal to #{exp}'
            , status
        );
    });
};