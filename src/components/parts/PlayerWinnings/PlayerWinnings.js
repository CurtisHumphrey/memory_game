import React from 'react'
import PropTypes from 'prop-types'
import Overdrive from 'react-overdrive'

import './PlayerWinnings.scss'
import Pile from '../Pile'

const PAIR = 2
export class PlayerWinnings extends React.PureComponent {
  static propTypes = {
    className: PropTypes.string,
    is_active: PropTypes.bool,
    on_left: PropTypes.bool,
    name: PropTypes.string.isRequired,
    cards: PropTypes.array.isRequired,
  };
  static defaultProps = {
  };

  render_score = () => {
    const count = Math.floor(this.props.cards.length / PAIR)
    if (count === 0) return null
    return (
      <div styleName='score'>
        - {count}
      </div>
    )
  }

  render_active = () => {
    if (!this.props.is_active) return null

    return (
      <Overdrive id='active_token'>
        <div styleName={'active' + (this.props.on_left ? ' right' : ' left')} />
      </Overdrive>
    )
  }

  render () {
    return (
      <div styleName='root'>
        <div styleName='top'>
          <div styleName='name'>{this.props.name}</div>
          {this.render_score()}
        </div>
        <div styleName='pile_row'>
          <Pile cards={this.props.cards} />
          {this.render_active()}
        </div>
      </div>
    )
  }
}
export default PlayerWinnings
