import React from 'react'
import PropTypes from 'prop-types'

import css_names from './Fade.scss'
import { CSSTransition } from 'react-transition-group'
import _ from 'lodash'

export class Fade extends React.PureComponent {
  static propTypes = {
    in: PropTypes.bool,
    children: PropTypes.node.isRequired,
  };
  static defaultProps = {
  };

  render () {
    let className = css_names.root
    if (_.get(this.props.children, 'props.className')) className += ' ' + this.props.children.props.className

    return (
      <CSSTransition
        in={this.props.in}
        classNames={css_names}
        timeout={300}
        appear
      >
        {React.cloneElement(this.props.children, {className})}
      </CSSTransition>
    )
  }
}
export default Fade
