const base_resolve = require('./base_resolve')
const globals = require('./globals')
const {__DEV__, __TEST__} = globals
const __NOT_COMPILE__ = __DEV__ || __TEST__

module.exports = (css_module_name) => ({
  cacheDirectory : true,
  presets: [['es2015', {modules: false}], 'react', 'stage-0'],
  plugins: [
    [
      'babel-plugin-add-react-displayname',
      'transform-react-remove-prop-types',
      {
        ignoreFilenames: __NOT_COMPILE__ ? ['.*'] : undefined,
      },
    ],
    [
      'react-css-modules',
      {
        context: base_resolve('src'),
        exclude: 'node_modules',
        generateScopedName: css_module_name,
        webpackHotModuleReloading: __DEV__,
        filetypes: {
          '.scss': {
            syntax: 'postcss-scss',
          },
        },
      },
    ],
    [
      'react-docgen',
      {
        resolver: 'findAllExportedComponentDefinitions',
      },
    ],
  ].concat(!__TEST__ ? [] : [
    [
      'istanbul',
      {
        exclude: [
          '**/*.spec.js',
          '**/node_modules/**',
        ],
      },
    ],
  ]),
})
