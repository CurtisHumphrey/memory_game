const debug = require('debug')('app:webpack:cdn_and_externals')
const {__PROD__} = require('./globals')

const REACT_VERSION = '16.7.0'
const LODASH_VERSION = '4.17.11'
const FIREBASE_VERSION = '5.7.2'

debug(`Adding Lodash ${LODASH_VERSION} from cdn`)

const externals = {
  'lodash': '_',
  'lodash/camelCase': '_.camelCase',
  'lodash/find': '_.find',
  'lodash/identity': '_.identity',
  'lodash/includes': '_.includes',
  'lodash/isArray': '_.isArray',
  'lodash/isEmpty': '_.isEmpty',
  'lodash/isEqual': '_.isEqual',
  'lodash/isFunction': '_.isFunction',
  'lodash/isNil': '_.isNil',
  'lodash/isPlainObject': '_.isPlainObject',
  'lodash/isString': '_.isString',
  'lodash/isSymbol': '_.isSymbol',
  'lodash/reduce': '_.reduce',
  'lodash/toString': '_.toString',

  'lodash.assign': '_.assign',
  'lodash.isarguments': '_.isArguments',
  'lodash.isarray': '_.isArray',
  'lodash.isplainobject': '_.isPlainObject',
  'lodash.keys': '_.keys',

  'lodash-es/isPlainObject': '_.isPlainObject',
}

const cdn_js = [
  // babel-polyfill must be first
  'https://cdnjs.cloudflare.com/ajax/libs/babel-polyfill/6.7.4/polyfill.min.js',
  `https://cdnjs.cloudflare.com/ajax/libs/lodash.js/${LODASH_VERSION}/lodash.min.js`,
]

if (__PROD__) {
  debug(`Adding React ${REACT_VERSION} for production or stage`)

  externals.react = 'React'
  externals['react-dom'] = 'ReactDOM'

  cdn_js.push(
    `https://unpkg.com/react@${REACT_VERSION}/umd/react.production.min.js`,
    `https://unpkg.com/react-dom@${REACT_VERSION}/umd/react-dom.production.min.js`,
  )
}
if (__PROD__) {
  debug(`Adding firebase ${FIREBASE_VERSION} for production or stage`)

  externals.firebase = 'firebase'
  externals['firebase/app'] = 'firebase'
  externals['firebase/auth'] = 'firebase'
  externals['firebase/database'] = 'firebase'

  cdn_js.push(
    `https://unpkg.com/react@${REACT_VERSION}/umd/react.production.min.js`,
    `https://unpkg.com/react-dom@${REACT_VERSION}/umd/react-dom.production.min.js`,
    `/__/firebase/${FIREBASE_VERSION}/firebase-app.js`,
    `/__/firebase/${FIREBASE_VERSION}/firebase-auth.js`,
    `/__/firebase/${FIREBASE_VERSION}/firebase-database.js`,
    '/__/firebase/init.js',
  )
}

module.exports = {
  externals,
  cdn_js,
}
