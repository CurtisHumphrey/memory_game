import {
  ACTION_TYPES,
  // actions as simple_actions,
  private_actions,
  selectors,
} from './game_management_simple'

import _ from 'lodash'
import {firebase_actions, SPECIAL_VALUES} from 'redux_firebase'

import get_shuffle_cards from 'redux/utils/get_shuffle_cards'

import {
  actions as cards_actions,
  selectors as cards_selectors,
} from '../cards_locations'

import {
  actions as players_actions,
  selectors as players_selectors,
} from '../players'

const make_meta_path = (game_id) => `/games/${game_id}/meta`
const get_base_path = (getState) => make_meta_path(selectors.game_id(getState()))
const make_path = (getState, append = '') => ({path: `${get_base_path(getState)}/${append}`})

const change_phase = (phase) => (dispatch, getState) => {
  dispatch(firebase_actions.set(phase, make_path(getState, 'phase')))
}

const TOTAL_CARDS = 24

export const new_game = () => (dispatch, getState) => {
  const old_id = selectors.game_id(getState())

  const ref = dispatch(firebase_actions.push({
    created_at: SPECIAL_VALUES.TIMESTAMP,
    meta: {
      phase: 'setup',
    },
  }, {path: '/games'}))

  const game_id = ref.key
  dispatch(private_actions.set_game_id(game_id))

  dispatch(firebase_actions.switch({
    path: make_meta_path(game_id),
    old_path: old_id ? make_meta_path(old_id) : '',
    update_action: ACTION_TYPES.update_meta,
  }))

  dispatch(cards_actions.listen_for_cards(game_id))
  dispatch(players_actions.listen_for_players(game_id))

  dispatch(cards_actions.setup_cards(get_shuffle_cards(TOTAL_CARDS)))
  dispatch(firebase_actions.set('dealer', {path: make_meta_path(game_id) + '/phase'}))

  if (old_id) {
    dispatch(firebase_actions.set(game_id, {path: make_meta_path(old_id) + '/next_game_id'}))
  }
}

const DEAL_SPACING = 100 // ms
const deal_top_card = () => (dispatch, getState) => {
  const top_card = _.last(cards_selectors.dealer_deck(getState()))
  if (top_card == null) {
    change_phase('playing')(dispatch, getState)
    return // all done
  }

  dispatch(cards_actions.move_card({
    id: top_card.id,
    new_location: 'board',
  }))

  setTimeout(() => deal_top_card()(dispatch, getState), DEAL_SPACING)
}

export const deal_cards = () => (dispatch, getState) => {
  deal_top_card()(dispatch, getState)
}

const missing_cards = (board_cards) => board_cards.filter((c) => c == null).length

const PAIR = 2
const get_completed_order = (board_cards) => {
  return Math.floor(missing_cards(board_cards) / PAIR)
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
    const location = players_selectors.active_player(getState())
    const completed_order = get_completed_order(board_cards)
    dispatch(cards_actions.move_card({
      id: card.id,
      location,
      completed_order,
    }))
    dispatch(cards_actions.move_card({
      id: last_card.id,
      location,
      completed_order,
    }))
    dispatch(players_actions.switch_players())

    if ((completed_order + 1) * PAIR >= TOTAL_CARDS) {
      change_phase('finished')(dispatch, getState)
    }
  } else {
    // no match
    setTimeout(() => {
      dispatch(cards_actions.hide_cards([last_card, card]))
      dispatch(players_actions.switch_players())
    }, SHOW_DELAY)
  }
}
