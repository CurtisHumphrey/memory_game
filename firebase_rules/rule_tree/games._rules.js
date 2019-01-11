import * as h from '../helpers.js'

export default {
  '.write': h.create_only(),
  '$game_id': {
    '.read': true,
    '.write': true,
  },
}
