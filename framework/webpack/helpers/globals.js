const parts = require('child_process').execSync('git describe --tags --long').toString().split('-')
const tag = (parts[0][0] === 'v') ? parts[0].slice(1) : parts[0]
const hash = (parts[2][0] === 'g') ? parts[2].slice(1) : parts[2]
const __VERSION__ = JSON.stringify(`${tag}-${hash}`)

const env = process.env.NODE_ENV || 'production'

module.exports = {
  __VERSION__,
  __DEV__: env === 'development',
  __TEST__: env === 'test',
  __PROD__: env === 'production',
  __FIREBASE_PROD__: process.env.FIREBASE === 'prod',
  __BUNDLE_ANALYZE__: process.env.BUNDLE_ANALYZE,
}
