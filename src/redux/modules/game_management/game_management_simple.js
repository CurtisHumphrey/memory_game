import Immutable from 'seamless-immutable'
import { createSelector } from 'reselect'
import {
  make_simple_selectors,
  make_reducer_n_actions,
} from 'redux_helpers'
import _ from 'lodash'

import {
  selectors as cards_selectors,
} from '../cards_locations'

// -------
// Initial State
// --------

export const TOTAL_CARDS = 24

const initial_state = {
  game_id: '',
  active_player: 'host',
  which_player_is_me: 'host',
  game_joined: false,
}

// -------
// Selectors
// --------
const BASE = 'game_management'
export {BASE as BASE_SELECTOR_PATH}

const simple_selectors = make_simple_selectors(initial_state, BASE)

const is_dealer = createSelector(
  simple_selectors.which_player_is_me,
  (state) => cards_selectors.dealer_deck(state), // mockable
  (is_me, {length}) => {
    return is_me === 'host' && length === TOTAL_CARDS
  }
)

const game_finished = createSelector(
  (state) => cards_selectors.matched_card_count(state), // mockable
  (count) => count >= TOTAL_CARDS
)

const playing_phase = createSelector(
  game_finished,
  (state) => cards_selectors.dealer_deck(state), // mockable
  (finished, {length}) => !finished && length === 0
)

const my_turn = createSelector(
  playing_phase,
  simple_selectors.which_player_is_me,
  simple_selectors.active_player,
  (is_playable, is_me, active) => is_playable && is_me === active
)

const can_start_new_game = createSelector(
  game_finished,
  simple_selectors.which_player_is_me,
  (finished, is_me) => finished && is_me === 'host'
)

export const selectors = {
  ...simple_selectors,
  is_dealer,
  my_turn,
  game_finished,
  can_start_new_game,
}

// ------------------------------------
// Reducer and Actions
// ------------------------------------
const action_types_prefix = 'game_management/'

const public_handlers = {
  am_friend: (state) => state.merge({which_player_is_me: 'friend'}),
}

const private_handlers = {
  am_spectator: (state) => state.merge({which_player_is_me: 'spectator'}),
  update_meta: (state, {payload}) => state.merge(_.defaultTo(payload, {})),
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
