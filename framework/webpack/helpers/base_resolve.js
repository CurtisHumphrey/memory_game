const path = require('path')

function base_resolve () {
  const args = [path.resolve(__dirname, '../../..')].concat([].slice.call(arguments))
  return path.resolve.apply(path, args)
}

module.exports = base_resolve
