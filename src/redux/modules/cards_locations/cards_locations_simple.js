import Immutable from 'seamless-immutable'
import { createSelector } from 'reselect'
import {
  make_simple_selectors,
  make_reducer_n_actions,
} from 'redux_helpers'
import _ from 'lodash'

// -------
// Initial State
// --------

const initial_state = {
  cards: {},
  game_id: '',
}

// -------
// Selectors
// --------
const BASE = 'cards_locations'
export {BASE as BASE_SELECTOR_PATH}

const simple_selectors = make_simple_selectors(initial_state, BASE)

const shuffle_order = createSelector(
  simple_selectors.cards,
  (cards) => _.sortBy(cards, 'shuffle_order')
)

const completed_order = createSelector(
  simple_selectors.cards,
  (cards) => _.sortBy(cards, 'completed_order')
)

const board_cards = createSelector(
  shuffle_order,
  (cards) => cards.map((card) => (card.location !== 'board') ? null : card)
)
const FINISH_PILES = ['host', 'friend']
const matched_card_count = createSelector(
  simple_selectors.cards,
  (cards) => _.reduce(cards, (count, {location}) => {
    if (FINISH_PILES.includes(location)) {
      return count + 1
    }
    return count
  }, 0)
)

const make_location_selector = (location, order) => createSelector(
  order,
  (cards) => _.filter(cards, {location})
)

const dealer_deck = make_location_selector('dealer', shuffle_order)
const host_cards = make_location_selector('host', completed_order)
const friend_cards = make_location_selector('friend', completed_order)

export const selectors = {
  ...simple_selectors,
  dealer_deck,
  board_cards,
  host_cards,
  friend_cards,
  matched_card_count,
}

// ------------------------------------
// Reducer and Actions
// ------------------------------------
const action_types_prefix = 'cards_locations/'

const public_handlers = {
}

const private_handlers = {
  update_cards: (state, {payload}) => state.merge({
    cards: Immutable.replace(state.cards, _.defaultTo(payload, {}), {deep: true}),
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
