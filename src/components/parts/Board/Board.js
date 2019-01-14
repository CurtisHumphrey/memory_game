import React from 'react'
import PropTypes from 'prop-types'
import _ from 'lodash'

import './Board.scss'
import Card from 'components/parts/Card'
import EmptyCardSpace from 'components/parts/EmptyCardSpace'

export class Board extends React.PureComponent {
  static propTypes = {
    className: PropTypes.string,
    cards: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.string,
    })).isRequired,
    my_turn: PropTypes.bool.isRequired,
    onCardSelect: PropTypes.func.isRequired,
  };
  static defaultProps = {
  };

  _on_select = (id) => this.props.onCardSelect(_.find(this.props.cards, {id}))

  render_card_placement = (card, index) => {
    if (card == null) {
      return <EmptyCardSpace key={index} styleName='card' />
    }

    const onSelect = this.props.my_turn ? this._on_select : undefined

    return (
      <Card
        key={card.id}
        onSelect={onSelect}
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
