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
  })
})
