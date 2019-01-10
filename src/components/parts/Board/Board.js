import React from 'react'
import PropTypes from 'prop-types'

import './Board.scss'
import Card from 'components/parts/Card'
import EmptyCardSpace from 'components/parts/EmptyCardSpace'

export class Board extends React.PureComponent {
  static propTypes = {
    className: PropTypes.string,
    cards: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.string,
    })).isRequired,
    onCardSelect: PropTypes.func.isRequired,
  };
  static defaultProps = {
  };

  render_card_placement = (card, index) => {
    if (card == null) {
      return <EmptyCardSpace key={index} />
    }

    return (
      <Card
        key={card.id}
        onSelect={this.props.onCardSelect}
        {...card}
        styleName='card'
      />
    )
  }

  render () {
    return (
      <div styleName='root'>
        {this.props.cards.map(this.render_card_placement)}
      </div>
    )
  }
}
export default Board
