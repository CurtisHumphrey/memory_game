const debug = require('debug')('app:webpack')
const {
  DefinePlugin,
  NamedModulesPlugin,
  HotModuleReplacementPlugin,
} = require('webpack')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const FaviconsWebpackPlugin = require('favicons-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const ProgressBarPlugin = require('progress-bar-webpack-plugin')
const StatsPlugin = require('stats-webpack-plugin')
const UnusedWebpackPlugin = require('unused-webpack-plugin')
const {BundleAnalyzerPlugin} = require('webpack-bundle-analyzer')

const globals = require('./helpers/globals')
const template_vars = require('./helpers/template_vars')
const {externals} = require('./helpers/cdn_and_externals')
const postcss_options = require('./helpers/postcss_options')
const babel_loader_options = require('./helpers/babel_loader_options')

const base_resolve = require('./helpers/base_resolve')

const {__DEV__, __TEST__, __BUNDLE_ANALYZE__, __PROD__} = globals
const css_module_name = '[name]__[local]' // BROKEN + (process.env.STORYBOOK ? '' : '___[hash:base64:5]')

debug('Create configuration.')
debug(globals)

module.exports = {
  mode: __PROD__ ? 'production' : 'development',
  context: base_resolve(),
  entry: {
    app: './src/main',
  },
  output: {
    publicPath: '/',
    filename: !__PROD__ ? '[name].js' : '[name].[chunkhash].js',
    chunkFilename: !__PROD__ ? '[name].js' : '[name].[chunkhash].js',
  },
  devtool: __DEV__ ? 'source-map' : 'source-map',
  devServer: {
    contentBase: './src/static',
    compress: true,
    historyApiFallback: true,
    overlay: true,
    port: 3000,
    hot: __DEV__,
    noInfo: true,
    stats: 'minimal',
    // {
    //   children: false,
    //   chunks: false,
    //   chunkModules: false,
    //   chunkOrigins: false,
    //   modules: false,
    //   reasons: false,
    // },
    inline: !__BUNDLE_ANALYZE__,
    watchOptions: {
      aggregateTimeout: 3000,
    },
  },
  stats: {
    children: false,
    chunks: false,
    chunkModules: false,
    chunkOrigins: false,
    modules: false,
    reasons: false,
  },
  optimization: {
    minimize: __PROD__ && !__BUNDLE_ANALYZE__,
  },
  performance: {
    assetFilter: function (asset_filename) {
      if (/\.map$/.test(asset_filename)) return false // source maps
      if (/^icons-/.test(asset_filename)) return false // favicons outputs
      return true
    },
  },
  resolve: {
    modules: [base_resolve('src'), 'node_modules'],
    alias: {
      jQuery: 'jquery',
      'moment': 'moment/min/moment.min.js',
      'firebase_rules': base_resolve('firebase_rules/rules.json'),
    },
  },
  externals: {
    'analytics': 'analytics',
    ...externals,
  },
  plugins: [
    new ProgressBarPlugin(),
    new DefinePlugin(globals),
  ].concat(!__PROD__ ? [
    // Dev only
    new NamedModulesPlugin(),
    new HotModuleReplacementPlugin(),
  ] : [
    // Production only
    new CleanWebpackPlugin(['dist'], {root: base_resolve()}),
    new CopyWebpackPlugin([base_resolve('src/static')]),
    new MiniCssExtractPlugin({
      filename: '[name].[contenthash].css',
      chunkFilename: '[name].[contenthash].css',
    }),
  ]).concat(!__PROD__ ? [] : [
    // main site
    new FaviconsWebpackPlugin({
      logo: './src/images/icon.png',
      title: 'memory',
    }),
    new UnusedWebpackPlugin({
      directories: [base_resolve('src')],
      exclude: [
        'package.json',
        '.git',
        '*.scss', // keep in case they are need in the future
        '**/helpers/**', // keep helpers regardless
        '**/src/images/**', // images
        '**/static/*.txt',
        // not tested
        // 'main.js',
        // 'routes.js',
        // used in storybook
        '**/helpers_for_storybook/**', // keep helpers regardless
        '*example*', // keep example data regardless
        '*.stories.js',
        // used in tests
        '**/test_helpers/**', // keep helpers regardless
        '*spec.js',
        '*schema*.json',
      ],
      root: base_resolve('src'),
    }),
  ]).concat(__TEST__ ? [] : [
    new HtmlWebpackPlugin({
      template: base_resolve('src/index.esj'),
      minify: {
        collapseWhitespace: !__DEV__,
      },
      ...template_vars,
    }),
  ]).concat(!__BUNDLE_ANALYZE__ ? [] : [
    new BundleAnalyzerPlugin({
      defaultSizes: 'gzip',
      generateStatsFile: true,
      openAnalyzer: false,
    }),
  ]).concat([
    // Everything else **first**.
    new StatsPlugin('stats.json'),
  ]),
  module: {
    rules: [
      {
        test: /\.(html)(\?.*)?$/,
        use: {
          loader: 'html-loader',
          options: {
            attrs: ['img:src'],
          },
        },
      },
      {
        test: /\.css$/,
        use: [
          !__PROD__ ? 'style-loader' : MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              importLoaders: 1,
            },
          },
          {
            loader: 'postcss-loader',
            options: __TEST__ ? {} : postcss_options,
          },
        ],
      },
      {
        test: /\.scss$/,
        use: [
          !__PROD__ ? 'style-loader' : MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              modules: true,
              localIdentName: css_module_name,
              importLoaders: 1,
            },
          },
          {
            loader: 'postcss-loader',
            options: __TEST__ ? {} : postcss_options,
          },
          {
            loader: 'sass-loader',
          },
        ],
      },
      {
        test: /\.(mp3|png|jpg|gif|svg|eot|ttf|woff|woff2)$/,
        loader: 'file-loader',
        options: {
          name: !__PROD__ ? '[path][name].[ext]' : 'assets/[name][hash].[ext]',
        },
      },
      {
        test: /moment\.min\.js$/,
        use: 'imports-loader?require=>null',
        // fixes issue with ./locate
      },
      {
        test: /\.js$/,
        exclude: [
          base_resolve('node_modules'),
        ],
        loader: 'babel-loader',
        options: babel_loader_options(css_module_name),
      },
      {
        test: /\.js$/,
        include: [
          /redux_firebase/,
        ],
        loader: 'babel-loader',
        options: babel_loader_options(css_module_name),
      },
    ],
  },
}
