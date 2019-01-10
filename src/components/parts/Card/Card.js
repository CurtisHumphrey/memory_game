import React from 'react'
import PropTypes from 'prop-types'

import classNames from './Card.scss'
import { CSSTransition } from 'react-transition-group'
import get_house_url from 'images/houses'

export class Card extends React.PureComponent {
  static propTypes = {
    className: PropTypes.string,
    id: PropTypes.string.isRequired,
    show: PropTypes.bool,
    image_name: PropTypes.string.isRequired,
    onSelect: PropTypes.func.isRequired,
  };

  _click = () => {
    if (this.props.show) return
    this.props.onSelect(this.props.id)
  }

  render () {
    const {id, show, image_name, className, ...others} = this.props
    return (
      <div
        styleName={show ? 'show_front' : 'show_back'}
        className={className}
        onClick={this._click}
        {...others}
      >
        <CSSTransition
          in={show}
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
