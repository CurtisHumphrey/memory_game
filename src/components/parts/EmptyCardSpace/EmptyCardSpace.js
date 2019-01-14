import React from 'react'
import PropTypes from 'prop-types'

import '../Card/Card.scss'

export class EmptyCardSpace extends React.PureComponent {
  static propTypes = {
    className: PropTypes.string,
  };

  render () {
    const {className, ...others} = this.props
    return (
      <div styleName='root' className={className} {...others} />
    )
  }
}
export default EmptyCardSpace
