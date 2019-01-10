import React from 'react'
import PropTypes from 'prop-types'

import classNames from './Card.scss'
import { CSSTransition } from 'react-transition-group'

export class Card extends React.PureComponent {
  static propTypes = {
    show: PropTypes.bool,
    picture_url: PropTypes.string.isRequired,
  };

  static defaultProps = {
  };

  render () {
    return (
      <div styleName='root'>
        <CSSTransition
          in={this.props.show}
          classNames={classNames}
          timeout={500}
          appear
        >
          <div styleName='card'>
            <div styleName='front'>
              <img src={this.props.picture_url} />
            </div>
            <div styleName='back' />
          </div>
        </CSSTransition>
      </div>
    )
  }
}
export default Card
