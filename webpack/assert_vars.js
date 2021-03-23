const assert = require('assert')

module.exports = function assertEnvironmentVariables (requiredVariables) {
  const errMsg = (name) => `Environment variable "${name}" is required.`
  for (const variable of requiredVariables) {
    assert(process.env[variable], errMsg(variable))
    if (variable === 'ENVIRONMENT') {
      const expectedValues = ['local', 'integration', 'development', 'staging', 'production']
      assert(expectedValues.includes(process.env[variable]), `Environment variable "${variable}" must be one of the following ${expectedValues.join(', ')}.`)
    }
  }
}