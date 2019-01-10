import _debug from 'debug'
const debug = _debug('app:firebase_rules')
debug('making rules')

import jsonfile from 'jsonfile'
jsonfile.spaces = 2

import path from 'path'
const filename = path.resolve(__dirname) + '/rules.json'

import rules from './rule_tree/_root._rules.js'

import current_rules from './rules.json'

if (JSON.stringify(current_rules) === JSON.stringify({rules})) {
  debug('rules are the same - no output')
} else {
  jsonfile.writeFileSync(filename, {rules})
  debug('Wrote rules.json')
}
