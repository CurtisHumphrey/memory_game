const debug = require('debug')('app:karma')
const webpack_config = require('../webpack/main.config')
var merge = require('webpack-merge')

debug('Create configuration.')

const test_bundler = './framework/testing/test-bundler.js'

const karmaConfig = {
  basePath: '../../', // project root in relation to framework/build/karma.js
  files: [
    './node_modules/babel-polyfill/dist/polyfill.js', // need for react-css-modules
    // libs that are CDN in index
    './node_modules/lodash/lodash.js',
    {
      pattern: test_bundler,
      watched: false,
      served: true,
      included: true,
    },
  ],
  frameworks: ['mocha'],
  reporters: ['mocha', 'coverage'],
  mochaReporter: {
    output: 'autowatch',
    showDiff: true,
    // maxLogLines: 6,
  },
  autoWatchBatchDelay: 500,
  browsers: ['ChromeHeadless'],
  reportSlowerThan: 5,
  coverageReporter: {
    reporters: [
      { type : 'text-summary' },
      { type : 'html', dir : 'coverage', 'subdir' : 'html' },
    ],
    watermarks: {
      statements: [ 85, 95 ],
      functions: [ 85, 95 ],
      branches: [ 85, 95 ],
      lines: [ 85, 95 ],
    },
  },
  browserConsoleLogOptions: {
    level: 'log',
    terminal: true,
  },
  browserNoActivityTimeout: 60000,
  processKillTimeout: 5000,
  client: {
    captureConsole: true,
  },
  preprocessors: {
    [test_bundler]: ['webpack', 'sourcemap'],
  },
  webpack: merge.smart(webpack_config, {
    devtool: 'cheap-module-eval-source-map',
    externals: {
      'text-encoding': 'window',
      'firebase-json': 'window',
    },
  }),
  webpackMiddleware: {
    noInfo: true,
    stats: 'minimal',
  },
}

// cannot use `export default` because of Karma.
module.exports = (cfg) => cfg.set(karmaConfig)
