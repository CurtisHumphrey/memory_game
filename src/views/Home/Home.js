import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import Helmet from 'react-helmet'
import { createStructuredSelector } from 'reselect'
import { grep_matching_from_object } from 'helpers/redux_helpers'

import './Home.scss'

import Table from 'components/parts/Table'
import Setup from 'components/parts/Setup'

import {
  selectors as game_selectors,
  actions as game_actions,
} from 'redux/modules/game_management'

export const selectors = grep_matching_from_object({
  game_id: game_selectors,
})

export const actions = grep_matching_from_object({
  am_friend: game_actions,
  new_game: game_actions,
  join_game: game_actions,
  become_friend: game_actions,
})

const mapStateToProps = createStructuredSelector(selectors)

export class Home extends React.PureComponent {
  static propTypes = {
    className: PropTypes.string,
    match: PropTypes.shape({
      params: PropTypes.shape({
        game_id: PropTypes.string,
      }).isRequired,
    }).isRequired,

    // from redux
    game_id: PropTypes.string.isRequired,

    am_friend: PropTypes.func.isRequired,
    new_game: PropTypes.func.isRequired,
    join_game: PropTypes.func.isRequired,
    become_friend: PropTypes.func.isRequired,
  };
  static defaultProps = {
  };

  componentDidMount () {
    const {game_id} = this.props.match.params
    if (game_id) {
      this.props.am_friend()
      this.props.join_game(game_id)
        .then(this.props.become_friend)
    } else if (!this.props.game_id) {
      this.props.new_game()
    }
  }

  render () {
    return (
      <div styleName='root'>
        <Helmet
          title={'Home'}
          meta={[{
            name: 'description',
            content: '',
          }]}
        />
        <Table />
        <Setup />
      </div>
    )
  }
}
export default connect(mapStateToProps, actions)(Home)
