import {
  ACTION_TYPES,
  // actions as simple_actions,
  private_actions,
  selectors,
} from './players_simple'

// import _ from 'lodash'
import {firebase_actions} from 'redux_firebase'

const make_players_path = (game_id) => `/games/${game_id}/players`
const get_base_path = (getState) => make_players_path(selectors.game_id(getState()))
const make_path = (getState, append = '') => ({path: `${get_base_path(getState)}/${append}`})

export const listen_for_players = (game_id) => (dispatch, getState) => {
  const old_id = selectors.game_id(getState())

  dispatch(private_actions.set_game_id(game_id))

  dispatch(firebase_actions.switch({
    path: make_players_path(game_id),
    old_path: old_id ? make_players_path(old_id) : '',
    update_action: ACTION_TYPES.update_cards,
  }))
}

export const switch_players = () => (dispatch, getState) => {
  dispatch(firebase_actions.set(
    selectors.active_player(getState()) === 'host' ? 'friend' : 'host',
    make_path(getState, 'active_player')
  ))
}

export const set_name = (name) => (dispatch, getState) => {
  const name_type = selectors.which_player_is_me(getState())
  dispatch(firebase_actions.set(
    name,
    make_path(getState, `${name_type}_name`)
  ))
}
