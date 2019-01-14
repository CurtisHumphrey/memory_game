import React from 'react'
import PropTypes from 'prop-types'

import './DealerDeck.scss'
import Pile from '../Pile'

export class DealerDeck extends React.PureComponent {
  static propTypes = {
    className: PropTypes.string,
    cards: PropTypes.array.isRequired,
    is_dealer: PropTypes.bool,
    game_joined: PropTypes.bool.isRequired,
    can_start_new_game: PropTypes.bool.isRequired,
    onDeal: PropTypes.func.isRequired,
    onReshuffle: PropTypes.func.isRequired,
  };

  static defaultProps = {
  };

  render_deal = () => {
    if (!this.props.is_dealer) return null
    return (
      <button onClick={this.props.onDeal} disabled={!this.props.game_joined}>Deal</button>
    )
  }

  render_reshuffle = () => {
    if (!this.props.can_start_new_game) return null
    return (
      <button onClick={this.props.onReshuffle} disabled={!this.props.game_joined}>New Game</button>
    )
  }

  render () {
    return (
      <div styleName='root'>
        <Pile cards={this.props.cards} />
        {this.render_deal()}
        {this.render_reshuffle()}
      </div>
    )
  }
}
export default DealerDeck
