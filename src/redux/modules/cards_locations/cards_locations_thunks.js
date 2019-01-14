import {
  ACTION_TYPES,
  // actions as simple_actions,
  private_actions,
  selectors,
} from './cards_locations_simple'

import _ from 'lodash'
import {firebase_actions} from 'redux_firebase'

const make_cards_path = (game_id) => `/games/${game_id}/cards`
const get_base_path = (getState) => make_cards_path(selectors.game_id(getState()))
const make_path = (getState, append = '') => ({path: `${get_base_path(getState)}/${append}`})

export const listen_for_cards = (game_id) => (dispatch, getState) => {
  dispatch(private_actions.set_game_id(game_id))

  dispatch(firebase_actions.on({
    path: make_cards_path(game_id),
    update_action: ACTION_TYPES.update_cards,
  }))
}

export const show_card = (card_id) => (dispatch, getState) => {
  dispatch(firebase_actions.set(
    true,
    make_path(getState, `${card_id}/show_front`)
  ))
}

export const hide_cards = (cards) => (dispatch, getState) => {
  const updates = _.reduce(cards, (collection, card) => {
    collection[`${card.id}/show_front`] = false
    return collection
  }, {})
  dispatch(firebase_actions.update(
    updates,
    make_path(getState)
  ))
}

export const move_cards = (moves) => (dispatch, getState) => {
  const updates = _.reduce(moves, (collection, {id, new_location, completed_order = null}) => {
    collection[`${id}/location`] = new_location
    collection[`${id}/completed_order`] = completed_order
    return collection
  }, {})

  dispatch(firebase_actions.update(
    updates,
    make_path(getState)
  ))
}

export const setup_cards = (cards) => (dispatch, getState) => {
  dispatch(firebase_actions.set(
    cards,
    make_path(getState)
  ))
}
