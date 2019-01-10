import React from 'react'
import PropTypes from 'prop-types'

import './Card.scss'
import posed from 'react-pose'
import get_house_url from 'images/houses'

export const CardPose = posed.div({
  front: {
    transform: 'rotateY(-180deg)',
  },
  back: {
    transform: 'rotateY(0deg)',
  },
})

export class Card extends React.PureComponent {
  static propTypes = {
    className: PropTypes.string,
    id: PropTypes.string.isRequired,
    show_front: PropTypes.bool,
    image_name: PropTypes.string.isRequired,
    onSelect: PropTypes.func,
  };

  _click = () => {
    if (this.props.show_front) return
    if (this.props.onSelect == null) return
    this.props.onSelect(this.props.id)
  }

  render () {
    const {id, show_front, image_name, className, onSelect, ...others} = this.props
    const clickable = !show_front && onSelect ? ' clickable' : ''

    return (
      <div
        styleName={'root' + clickable}
        className={className}
        onClick={this._click}
        {...others}
      >
        <CardPose
          pose={show_front ? 'front' : 'back'}
          styleName='card'
        >
          <div styleName='card_hover'>
            <div styleName='front'>
              <img src={get_house_url(image_name)} />
            </div>
            <div styleName='back' />
          </div>
        </CardPose>
      </div>
    )
  }
}
export default Card
