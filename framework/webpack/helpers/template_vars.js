// const debug = require('debug')('app:webpack:template')

const {cdn_js} = require('./cdn_and_externals')

const cdn_string = cdn_js.map((js) => {
  return `<script crossorigin type="text/javascript" src="${js}"></script>`
}).join('\n')

module.exports = {
  cdn_string,
}
