import React from 'react'
import {
  shallow,
} from 'enzyme'
import _ from 'lodash'

import {
  Table,
  actions,
  selectors,
} from './Table'

// import stylesClass from './Table.scss'
// const styles = _.mapValues(stylesClass, (raw) => '.' + raw)

export const Table_specs = describe('<Table />', () => {
  let sandbox
  let props
  let prop_actions
  let prop_selectors

  beforeEach(() => {
    sandbox = sinon.sandbox.create()

    require('react-proptype-error-catcher')(sandbox)

    prop_selectors = {
      active_player: 'host',
      is_dealer: true,
      game_joined: true,
      my_turn: true,
      can_start_new_game: false,

      dealer_deck: [],
      board_cards: [],
      host_cards: [],
      friend_cards: [],
    }
    prop_actions = {
      select_card: sandbox.stub(),
      deal_cards: sandbox.stub(),
      re_shuffle: sandbox.stub(),
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
      const wrapper = shallow(<Table {...props} />)
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
    it('if active_player is host set first PlayerWinnings to is_active', () => {
      props.active_player = 'host'
      const wrapper = shallow(<Table {...props} />)
      expect(wrapper.find('PlayerWinnings').at(0)).to.have.prop('is_active').eql(true)
      expect(wrapper.find('PlayerWinnings').at(1)).to.have.prop('is_active').eql(false)
    })
    it('if active_player is friend set second PlayerWinnings to is_active', () => {
      props.active_player = 'friend'
      const wrapper = shallow(<Table {...props} />)
      expect(wrapper.find('PlayerWinnings').at(0)).to.have.prop('is_active').eql(false)
      expect(wrapper.find('PlayerWinnings').at(1)).to.have.prop('is_active').eql(true)
    })
  })
})
