import React from 'react'
import {
  shallow,
} from 'enzyme'
import _ from 'lodash'

import {
  Setup,
  actions,
  selectors,
} from './Setup'

import stylesClass from './Setup.scss'
const styles = _.mapValues(stylesClass, (raw) => '.' + raw)

export const Setup_specs = describe('<Setup />', () => {
  let sandbox
  let props
  let prop_actions
  let prop_selectors

  beforeEach(() => {
    sandbox = sinon.sandbox.create()

    require('react-proptype-error-catcher')(sandbox)

    prop_selectors = {
      which_player_is_me: 'host',
      game_id: 'an id',
      game_joined: false,
    }
    prop_actions = {
    }

    props = {
      ...prop_selectors,
      ...prop_actions,
    }
  })

  afterEach(() => {
    sandbox.restore()
  })

  describe('general', () => {
    it('with normal props it should render without errors', () => {
      const wrapper = shallow(<Setup {...props} />)
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
    it('when game_joined is false pose should be enter', () => {
      props.game_joined = false
      const wrapper = shallow(<Setup {...props} />)
      expect(wrapper).to.have.prop('pose').eql('enter')
    })
    it('do not show Starting until game_joined is true', () => {
      props.game_joined = false
      const wrapper = shallow(<Setup {...props} />)
      expect(wrapper).to.not.include.text('Starting')
      wrapper.setProps({game_joined: true})
      expect(wrapper).to.include.text('Starting')
    })
    it('when game_joined is true pose should be exit', () => {
      const wrapper = shallow(<Setup {...props} />)
      wrapper.setProps({game_joined: true})
      expect(wrapper).to.have.prop('pose').eql('exit')
    })
    it('when pose calls onPoseComplete render nothing', () => {
      const wrapper = shallow(<Setup {...props} />)
      expect(wrapper).to.be.not.empty
      wrapper.simulate('poseComplete')
      expect(wrapper).to.be.empty
    })
    it('when player is host render link based on game_id', () => {
      const wrapper = shallow(<Setup {...props} />)
      expect(wrapper.find(styles.link)).to.include.text(props.game_id)
    })
    it('when player is not host do not render link based on game_id', () => {
      props.which_player_is_me = 'friend'
      const wrapper = shallow(<Setup {...props} />)
      expect(wrapper.find(styles.link)).to.not.exist
    })
  })
})
