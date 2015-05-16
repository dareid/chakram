module.exports = function (chai, utils) {
    
    var setContainsFlag = function () {
        utils.flag(this,'contains',true);
    };
    
    utils.addProperty(chai.Assertion.prototype, "comprise", setContainsFlag);
    utils.addProperty(chai.Assertion.prototype, "comprised", setContainsFlag);
};
