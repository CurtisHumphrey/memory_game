import Immutable from 'seamless-immutable'
// import { createSelector } from 'reselect'
import {
  make_simple_selectors,
  make_reducer_n_actions,
} from 'redux_helpers'

// -------
// Initial State
// --------

const initial_state = {
  active_player: 'host',
}

// -------
// Selectors
// --------
const BASE = 'players'
export {BASE as BASE_SELECTOR_PATH}

const simple_selectors = make_simple_selectors(initial_state, BASE)

export const selectors = {
  ...simple_selectors,
}

// ------------------------------------
// Reducer and Actions
// ------------------------------------
const action_types_prefix = 'players/'

const public_handlers = {
  reset: () => Immutable(initial_state),
}

const private_handlers = {
}

export const {reducer, private_actions, actions, ACTION_TYPES} = make_reducer_n_actions({
  public_handlers,
  private_handlers,
  action_types_prefix,
  initial_state,
  Immutable,
})
export default reducer
