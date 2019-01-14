import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'
import { grep_matching_from_object } from 'helpers/redux_helpers'
import _ from 'lodash'
import posed from 'react-pose'

import './Setup.scss'

import {
  selectors as game_selectors,
} from 'redux/modules/game_management'

const RootPose = posed.div({
  enter: { opacity: 1 },
  exit: {
    opacity: 0,
    delay: 500,
    transition: {
      duration: 1000,
    },
  },
})

export const selectors = grep_matching_from_object({
  which_player_is_me: game_selectors,
  game_id: game_selectors,
  game_joined: game_selectors,
})

export const actions = {}

const mapStateToProps = createStructuredSelector(selectors)

export class Setup extends React.PureComponent {
  static propTypes = {
    className: PropTypes.string,

    which_player_is_me: PropTypes.string.isRequired,
    game_id: PropTypes.string.isRequired,
    game_joined: PropTypes.bool,
  };
  static defaultProps = {
  };
  state = {
    closed: false,
  }

  onPoseComplete = () => this.setState({closed: true})

  render_link = () => {
    if (this.props.which_player_is_me !== 'host') return null

    const {origin} = window.location
    const url = `${origin}/${this.props.game_id}`

    return (
      <div styleName='link_group'>
        <div styleName='label'>Link for friend to join</div>
        <div styleName='link'>{url}</div>
      </div>
    )
  }

  render_starting = () => {
    if (!this.props.game_joined) return null
    return <div styleName='big'>Starting!</div>
  }

  render () {
    if (this.state.closed) return null

    return (
      <RootPose
        styleName='root'
        onPoseComplete={this.onPoseComplete}
        onClick={_.noop}
        pose={this.props.game_joined ? 'exit' : 'enter'}
      >
        <div styleName='panel'>
          <div styleName='big'>You are the {this.props.which_player_is_me}</div>
          {this.render_starting()}
          {this.render_link()}
        </div>
      </RootPose>
    )
  }
}
export default connect(mapStateToProps, actions)(Setup)
