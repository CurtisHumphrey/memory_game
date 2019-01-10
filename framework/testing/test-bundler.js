// ---------------------------------------
// Test Environment Setup
// ---------------------------------------
import chai from './chai_setup'
import targaryen from 'targaryen/plugins/chai'
chai.use(targaryen)

// ---------------------------------------
// Require Tests
// ---------------------------------------

// require all `tests/**/*.spec.js`
const testsContext = require.context('../../src', true, /\.spec\.js$/)
testsContext.keys().forEach(testsContext)
