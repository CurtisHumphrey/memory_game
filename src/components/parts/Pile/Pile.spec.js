/* eslint no-magic-numbers: 0 */
import React from 'react'
import {
  shallow,
} from 'enzyme'
import _ from 'lodash'

import {
  Pile,
} from './Pile'

// import stylesClass from './Pile.scss'
// const styles = _.mapValues(stylesClass, (raw) => '.' + raw)

const TOTAL_CARDS = 24

const make_cards = (total) => _.times(TOTAL_CARDS, (id) => ({
  id: String(id),
  image_name: String(Math.floor(id / 2)),
  show_front: false,
}))

export const Pile_specs = describe('<Pile />', () => {
  let sandbox
  let props

  beforeEach(() => {
    sandbox = sinon.sandbox.create()

    require('react-proptype-error-catcher')(sandbox)

    props = {
      cards: make_cards(TOTAL_CARDS),
    }
  })

  afterEach(() => {
    sandbox.restore()
  })

  describe('general', () => {
    it('with normal props it should render without errors', () => {
      const wrapper = shallow(<Pile {...props} />)
      expect(wrapper).to.exist
    })
  })
  describe('behaviors', () => {
    it('if cards increase count do not change shifts', () => {
      props.cards = make_cards(10)
      const wrapper = shallow(<Pile {...props} />)
      const init_style = wrapper.find('Card').first().prop('style')
      wrapper.setProps({cards: make_cards(11)})
      const after_update_style = wrapper.find('Card').first().prop('style')

      expect(init_style).to.eql(after_update_style)
    })
    it('if cards decrease count do not change shifts', () => {
      props.cards = make_cards(10)
      const wrapper = shallow(<Pile {...props} />)
      const init_style = wrapper.find('Card').first().prop('style')
      wrapper.setProps({cards: make_cards(9)})
      const after_update_style = wrapper.find('Card').first().prop('style')

      expect(init_style).to.eql(after_update_style)
    })
  })
})
