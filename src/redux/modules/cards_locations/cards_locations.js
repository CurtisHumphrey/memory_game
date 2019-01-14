import reducer, {
  actions as simple_actions,
  private_actions,
  selectors,
  BASE_SELECTOR_PATH,
  ACTION_TYPES,
} from './cards_locations_simple'
import * as thunk_actions from './cards_locations_thunks'

export const actions = Object.assign({}, simple_actions, thunk_actions)

import {inject_reducers} from 'store/inject_reducers'
export default inject_reducers({[BASE_SELECTOR_PATH]: reducer})

export {
  selectors,
  BASE_SELECTOR_PATH,
  ACTION_TYPES,
  private_actions,
}
