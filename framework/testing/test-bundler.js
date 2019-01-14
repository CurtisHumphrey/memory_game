// ---------------------------------------
// Test Environment Setup
// ---------------------------------------
import chai from './chai_setup'
import targaryen from 'targaryen/plugins/chai'
chai.use(targaryen)

window.__STORE__ = {
  asyncReducers: {},
  replaceReducer: () => {},
  dispatch: () => {},
}

// ---------------------------------------
// Require Tests
// ---------------------------------------

// require all `tests/**/*.spec.js`
const testsContext = require.context('../../src', true, /\.spec\.js$/)
testsContext.keys().forEach(testsContext)
