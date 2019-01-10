import React from 'react'
import PropTypes from 'prop-types'

import classNames from './Card.scss'
import { CSSTransition } from 'react-transition-group'
import get_house_url from 'images/houses'

export class Card extends React.PureComponent {
  static propTypes = {
    className: PropTypes.string,
    id: PropTypes.string.isRequired,
    show_front: PropTypes.bool,
    image_name: PropTypes.string.isRequired,
    onSelect: PropTypes.func.isRequired,
  };

  _click = () => {
    if (this.props.show_front) return
    this.props.onSelect(this.props.id)
  }

  render () {
    const {id, show_front, image_name, className, ...others} = this.props
    return (
      <div
        styleName={'root' + (show_front ? '' : ' clickable')}
        className={className}
        onClick={this._click}
        {...others}
      >
        <CSSTransition
          in={show_front}
          classNames={classNames}
          timeout={500}
          appear
        >
          <div styleName='card'>
            <div styleName='front'>
              <img src={get_house_url(image_name)} />
            </div>
            <div styleName='back' />
          </div>
        </CSSTransition>
      </div>
    )
  }
}
export default Card
