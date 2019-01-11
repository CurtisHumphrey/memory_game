import Immutable from 'seamless-immutable'
// import { createSelector } from 'reselect'
import {
  make_simple_selectors,
  make_reducer_n_actions,
} from 'redux_helpers'
import _ from 'lodash'

// -------
// Initial State
// --------

const initial_state = {
  phase: 'setup',
  game_id: '',
  next_game_id: '',
}

// -------
// Selectors
// --------
const BASE = 'game_management'
export {BASE as BASE_SELECTOR_PATH}

const simple_selectors = make_simple_selectors(initial_state, BASE)

export const selectors = {
  ...simple_selectors,
}

// ------------------------------------
// Reducer and Actions
// ------------------------------------
const action_types_prefix = 'game_management/'

const public_handlers = {
}

const private_handlers = {
  update_meta: (state, {payload}) => state.merge({
    phase: payload.phase,
    next_game_id: _.defaultTo(payload.next_game_id, ''),
  }),
  set_game_id: (state, {payload}) => state.merge({game_id: payload}),
}

export const {reducer, private_actions, actions, ACTION_TYPES} = make_reducer_n_actions({
  public_handlers,
  private_handlers,
  action_types_prefix,
  initial_state,
  Immutable,
})
export default reducer
