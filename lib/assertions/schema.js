var tv4 = require('tv4'),
  path = require('./../utils/objectPath.js');

/**
Checks the schema of the returned JSON object against a provided {@link http://json-schema.org/ JSON Schema}. This assertion utilizes the brilliant {@link https://github.com/geraintluff/tv4 tv4 library}. An optional dot notation argument allows a subelement of the JSON object to checked against a JSON schema. Amoungst others, this can confirm types, array lengths, required fields, min and max of numbers and string lengths. For more examples see the test/assertions/schema.js tests.
@alias module:chakram-expectation.schema
@param {String} [subelement] - if specified a subelement of the JSON body is checked, specified using dot notation
@param {*} expectedSchema - a JSON schema object which should match the JSON body or the JSON body's subelement. For more details on format see {@link http://json-schema.org/ the JSON schema website}
@example
it("should check that the returned JSON object satisifies a JSON schema", function () {
    var response = chakram.get("http://httpbin.org/get");
    expect(response).to.have.schema('headers', {"required": ["Host", "Accept"]});
    expect(response).to.have.schema({
        "type": "object",
        properties: {
            url: {
                type: "string"
            },
            headers: {
                type: "object"
            }
        }
    });
    return chakram.wait();
});
 */

module.exports = function (chai, utils) {

  var chakram = require('./../chakram');

  utils.addMethod(chai.Assertion.prototype, 'schema', function () {

    var object = this._obj.body;
    var schema = arguments[arguments.length - 1];
    var subElement = '';

    if (arguments.length === 2) {
      subElement = arguments[0];
      object = path.get(utils, object, subElement);
    }

    var validationResult = tv4.validateMultiple(object, schema, chakram.schemaCyclicCheck, chakram.schemaBanUnknown);

    var composeErrorMessage = function () {
      var errorMsg = 'expected body to match JSON schema ' + JSON.stringify(schema, null, 2) + '.';
      if (validationResult.missing.length > 0) {
        errorMsg += '\n unresolved schemas: ' + JSON.stringify(validationResult.missing) + '.';
      }
      if(Array.isArray(validationResult.errors)) {
          validationResult.errors.forEach(function (error) {
            errorMsg += '\n-----\n error: ' + error.message + '.\n data path: ' + subElement + error.dataPath + '.\n schema path: ' + error.schemaPath + '.';
          });
      }
      return errorMsg;
    };

    this.assert(
      validationResult.valid && validationResult.missing.length === 0,
      composeErrorMessage(),
      'expected body to not match JSON schema ' + JSON.stringify(schema)
    );
  });
};
