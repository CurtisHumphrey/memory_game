import {
  ACTION_TYPES,
  // actions as simple_actions,
  private_actions,
  selectors,
  TOTAL_CARDS,
} from './game_management_simple'
import _ from 'lodash'
import {firebase_actions, SPECIAL_VALUES} from 'redux_firebase'

import get_shuffle_cards from 'redux/utils/get_shuffle_cards'

import {
  actions as cards_actions,
  selectors as cards_selectors,
} from '../cards_locations'

const make_meta_path = (game_id) => `/games/${game_id}/meta`
const get_base_path = (getState) => make_meta_path(selectors.game_id(getState()))
const make_path = (getState, append) => ({path: `${get_base_path(getState)}/${append}`})

export const join_game = (game_id) => (dispatch, getState) => {
  dispatch(private_actions.set_game_id(game_id))

  dispatch(cards_actions.listen_for_cards(game_id))

  return dispatch(firebase_actions.on({
    path: make_meta_path(game_id),
    update_action: ACTION_TYPES.update_meta,
  }))
}

export const re_shuffle = () => (dispatch, getState) => {
  dispatch(cards_actions.setup_cards(get_shuffle_cards(TOTAL_CARDS)))
}

export const new_game = () => (dispatch, getState) => {
  const cards = get_shuffle_cards(TOTAL_CARDS)
  const ref = dispatch(firebase_actions.push({
    created_at: SPECIAL_VALUES.TIMESTAMP,
    meta: {
      active_player: 'host',
    },
    cards,
  }, {path: '/games'}))

  const game_id = ref.key
  join_game(game_id)(dispatch, getState)
}

const DEAL_SPACING = 100 // ms
const deal_top_card = () => (dispatch, getState) => {
  const top_card = _.last(cards_selectors.dealer_deck(getState()))
  if (top_card == null) {
    return // all done
  }

  dispatch(cards_actions.move_cards([{
    id: top_card.id,
    new_location: 'board',
  }]))

  setTimeout(() => deal_top_card()(dispatch, getState), DEAL_SPACING)
}

export const become_friend = () => (dispatch, getState) => {
  const game_joined = selectors.game_joined(getState())

  if (game_joined) {
    dispatch(private_actions.am_spectator())
  } else {
    dispatch(firebase_actions.set(true, make_path(getState, 'game_joined')))
  }
}

export const deal_cards = () => (dispatch, getState) => {
  deal_top_card()(dispatch, getState)
}

const PAIR = 2
const get_completed_order = (state) => {
  return Math.floor(cards_selectors.matched_card_count(state) / PAIR)
}

const SHOW_DELAY = 1000
export const select_card = (card) => (dispatch, getState) => {
  const board_cards = cards_selectors.board_cards(getState())
  const shown_cards = board_cards.filter((c) => c != null && c.show_front)

  if (shown_cards.length >= PAIR) return

  dispatch(cards_actions.show_card(card.id))

  if (shown_cards.length === 0) return
  const last_card = shown_cards[0]

  if (last_card.image_name === card.image_name) {
    // match!
    const new_location = selectors.active_player(getState())
    const completed_order = get_completed_order(getState())

    setTimeout(() => {
      dispatch(cards_actions.move_cards([
        {
          id: card.id,
          new_location,
          completed_order,
        },
        {
          id: last_card.id,
          new_location,
          completed_order,
        },
      ]))
      switch_players(dispatch, getState)
    }, SHOW_DELAY)
  } else {
    // no match
    setTimeout(() => {
      dispatch(cards_actions.hide_cards([last_card, card]))
      switch_players(dispatch, getState)
    }, SHOW_DELAY)
  }
}

const switch_players = (dispatch, getState) => {
  dispatch(firebase_actions.set(
    selectors.active_player(getState()) === 'host' ? 'friend' : 'host',
    make_path(getState, 'active_player')
  ))
}
