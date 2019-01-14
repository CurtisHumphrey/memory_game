import React from 'react'
import PropTypes from 'prop-types'
import _ from 'lodash'

import './Pile.scss'
import Card from 'components/parts/Card'

const ROTATION_RANGE = 7
const TRANSATION_RANGE = 5

export class Pile extends React.PureComponent {
  static propTypes = {
    className: PropTypes.string,
    cards: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.string,
    })).isRequired,
  };

  static getDerivedStateFromProps (props, state) {
    if (props.cards.length <= state.shifts.length) {
      return null
    }

    return {
      shifts: props.cards.map((value, index) => ({
        rotate: _.random(-ROTATION_RANGE, ROTATION_RANGE),
        tx: _.random(-TRANSATION_RANGE, TRANSATION_RANGE),
        ty: _.random(-TRANSATION_RANGE, TRANSATION_RANGE),
      })),
    }
  }

  state = {
    shifts: [],
  }

  render_card_placement = (card, index) => {
    const {rotate, tx, ty} = this.state.shifts[index]
    return (
      <div styleName='center' key={card.id}>
        <Card
          {...card}
          style={{
            transform: `rotateZ(${rotate}deg) translate(${tx}px, ${ty}px)`,
          }}
        />
      </div>
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
export default Pile
