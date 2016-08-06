/**
Chakram Expectation
@module chakram-expectation
@desc Extends the {@link http://chaijs.com/api/bdd/ chai.expect} object with additional HTTP matchers.
 */

module.exports = [
    require('./statuscode.js'),
    require('./header.js'),
    require('./cookie.js'),
    require('./schema.js'),
    require('./json.js'),
    require('./compression.js'),
    require('./comprise.js'),
    require('./responsetime.js')
];
