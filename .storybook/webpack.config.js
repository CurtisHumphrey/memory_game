const debug = require('debug')('storybook:webpack')
const {
  DefinePlugin,
} = require('@storybook/react/node_modules/webpack')
const webpack_config = require('../framework/webpack/main.config')
const globals = require('../framework/webpack/helpers/globals')

const {rules} = webpack_config.module

module.exports = {
  module: {
    rules: rules.concat(
      {
        test: /\.js$/,
        include: /storybook-addon-specifications/,
        loader: 'babel-loader',
        options: rules.find(({loader}) => loader === 'babel-loader').options,
      },
    ),
  },
  resolve: webpack_config.resolve,
  externals: {
    'react/addons': true,
    'react/lib/ExecutionEnvironment': true,
    'react/lib/ReactContext': 'window',
  },
  plugins: [
    new DefinePlugin(globals),
  ],
}
