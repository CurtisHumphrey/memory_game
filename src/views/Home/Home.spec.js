import React from 'react'
import {
  shallow,
} from 'enzyme'
import _ from 'lodash'

import {
  Home,
  actions,
  selectors,
} from './Home'

// import stylesClass from './Home.scss'
// const styles = _.mapValues(stylesClass, (raw) => '.' + raw)

export const Home_specs = describe('<Home />', () => {
  let sandbox
  let props
  let prop_actions
  let prop_selectors

  beforeEach(() => {
    sandbox = sinon.sandbox.create()

    require('react-proptype-error-catcher')(sandbox)

    prop_selectors = {
      game_id: '',
    }
    prop_actions = {
      am_friend: sandbox.stub(),
      new_game: sandbox.stub(),
      join_game: sandbox.stub(),
      become_friend: sandbox.stub(),
    }

    prop_actions.join_game.returns({
      then: (cb) => cb(),
    })

    props = {
      ...prop_selectors,
      ...prop_actions,
      match: {
        params: {
          game_id: '',
        },
      },
    }
  })

  afterEach(() => {
    sandbox.restore()
  })

  describe('general', () => {
    it('with normal props it should render without errors', () => {
      const wrapper = shallow(<Home {...props} />)
      expect(wrapper).to.exist
    })
    it('redux actions for connect should be valid and complete', () => {
      if (_.keys(prop_actions).length) {
        expect(actions).to.contain.all.keys(prop_actions)
        _.forEach(actions, (actionFn, key) => {
          expect(actionFn, `name: ${key}`).to.be.a('function')
        })
      }
    })
    it('redux selectors for connect should be valid and complete', () => {
      if (_.keys(prop_selectors).length) {
        expect(selectors).to.contain.all.keys(prop_selectors)
        _.forEach(selectors, (selectorFn, key) => {
          expect(selectorFn, `name: ${key}`).to.be.a('function')
        })
      }
    })
  })
  describe('behaviors', () => {
    it('if there is not a game_id on the url create a new game on mount', () => {
      shallow(<Home {...props} />)
      expect(props.new_game).to.be.calledOnce
    })
    it('if upon remount there is a game_id from redux to do not call new_game (good for HMR)', () => {
      props.game_id = 'an_id'
      shallow(<Home {...props} />)
      expect(props.new_game).to.be.not.called
    })
    it('if there is a game_id on the url call am_friend', () => {
      props.match.params.game_id = 'an_id'
      shallow(<Home {...props} />)
      expect(props.am_friend).to.be.calledOnce
    })
    it('if there is a game_id on the url call join_game with game_id and then become_friend after', () => {
      props.match.params.game_id = 'an_id'
      shallow(<Home {...props} />)
      expect(props.join_game).to.be.calledWith('an_id')
      expect(props.become_friend).to.be.calledAfter(props.join_game)
    })
  })
})
