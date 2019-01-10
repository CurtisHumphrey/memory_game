import React from 'react'
// import PropTypes from 'prop-types'

import '../Card/Card.scss'

export class EmptyCardSpace extends React.PureComponent {
  render () {
    return (
      <div styleName='root' {...this.props} />
    )
  }
}
export default EmptyCardSpace
