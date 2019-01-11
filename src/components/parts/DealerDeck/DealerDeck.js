import React from 'react'
import PropTypes from 'prop-types'

import './DealerDeck.scss'
import Pile from '../Pile'

export class DealerDeck extends React.PureComponent {
  static propTypes = {
    className: PropTypes.string,
    cards: PropTypes.array.isRequired,
    can_deal: PropTypes.bool,
    onDeal: PropTypes.func.isRequired,
  };
  static defaultProps = {
  };

  render_deal = () => {
    if (!this.props.can_deal) return null
    return (
      <button onClick={this.props.onDeal}>Deal</button>
    )
  }

  render () {
    return (
      <div styleName='root'>
        <Pile cards={this.props.cards} />
        {this.render_deal()}
      </div>
    )
  }
}
export default DealerDeck
