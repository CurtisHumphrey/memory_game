import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'
import { grep_matching_from_object } from 'helpers/redux_helpers'

import './Table.scss'
import Board from '../Board'
import PlayerWinnings from '../PlayerWinnings'
import DealerDeck from '../DealerDeck'

import {
  selectors as game_selectors,
  actions as game_actions,
} from 'redux/modules/game_management'

import {
  selectors as cards_selectors,
} from 'redux/modules/cards_locations'

export const selectors = grep_matching_from_object({
  active_player: game_selectors,
  is_dealer: game_selectors,
  game_joined: game_selectors,
  my_turn: game_selectors,
  can_start_new_game: game_selectors,

  dealer_deck: cards_selectors,
  board_cards: cards_selectors,
  host_cards: cards_selectors,
  friend_cards: cards_selectors,
})

export const actions = grep_matching_from_object({
  select_card: game_actions,
  deal_cards: game_actions,
  re_shuffle: game_actions,
})

const mapStateToProps = createStructuredSelector(selectors)

export class Table extends React.PureComponent {
  static propTypes = {
    className: PropTypes.string,

    // from redux
    active_player: PropTypes.string.isRequired,
    is_dealer: PropTypes.bool.isRequired,
    game_joined: PropTypes.bool.isRequired,
    my_turn: PropTypes.bool.isRequired,
    can_start_new_game: PropTypes.bool.isRequired,

    dealer_deck: PropTypes.array.isRequired,
    board_cards: PropTypes.array.isRequired,
    host_cards: PropTypes.array.isRequired,
    friend_cards: PropTypes.array.isRequired,

    select_card: PropTypes.func.isRequired,
    deal_cards: PropTypes.func.isRequired,
    re_shuffle: PropTypes.func.isRequired,
  };
  static defaultProps = {
  };

  render () {
    const {
      active_player,
      is_dealer,
      game_joined,
      my_turn,
      can_start_new_game,
      dealer_deck,
      board_cards,
      host_cards,
      friend_cards,
      select_card,
      deal_cards,
      re_shuffle,
    } = this.props

    return (
      <div styleName='root'>
        <div styleName='player_row'>
          <PlayerWinnings
            on_left
            is_active={active_player === 'host'}
            name='host'
            cards={host_cards}
          />
          <DealerDeck
            cards={dealer_deck}
            is_dealer={is_dealer}
            game_joined={game_joined}
            onDeal={deal_cards}
            can_start_new_game={can_start_new_game}
            onReshuffle={re_shuffle}
          />
          <PlayerWinnings
            is_active={active_player !== 'host'}
            name='friend'
            cards={friend_cards}
          />
        </div>
        <div styleName='board'>
          <Board
            cards={board_cards}
            onCardSelect={select_card}
            my_turn={my_turn}
          />
        </div>
      </div>
    )
  }
}
export default connect(mapStateToProps, actions)(Table)
