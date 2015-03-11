module.exports = function (chai, utils) {

    var getCookie = function (jar, url, key) {
        var cookies = jar.getCookies(url);
        for(var ct = 0; ct < cookies.length; ct++) {
            if(cookies[ct].key === key) {
                return cookies[ct];
            }
        }
        return null;
    };
    
    var getCookieValue = function (jar, url, key) {
        var cookie = getCookie(jar, url, key);
        return (cookie === null ? null : cookie.value);
    };
    
    utils.addMethod(chai.Assertion.prototype, 'cookie', function (key, value) {
        var cookieValue = getCookieValue(this._obj.jar, this._obj.url, key);
        if(arguments.length === 1) {
            this.assert(
                cookieValue !== undefined && cookieValue !== null, 
                'expected cookie '+ key +' to exist', 
                'expected cookie '+ key +' not to exist'
            );
        } else if (value instanceof RegExp) {
            this.assert(
                value.test(cookieValue),
                'expected cookie '+ key + ' with value ' + cookieValue + ' to match regex '+value,
                'expected cookie '+ key + ' with value ' + cookieValue + ' not to match regex '+value
            );
        } else {
            this.assert(
                cookieValue === value,
                'expected cookie '+ key + ' with value ' + cookieValue + ' to match '+value,
                'expected cookie '+ key + ' with value ' + cookieValue + ' not to match '+value
            );
        }
    });
};