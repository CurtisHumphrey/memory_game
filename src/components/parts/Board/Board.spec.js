/* eslint no-magic-numbers: 0 */
import React from 'react'
import {
  shallow,
} from 'enzyme'
import _ from 'lodash'

import {
  Board,
} from './Board'

// import stylesClass from './Board.scss'
// const styles = _.mapValues(stylesClass, (raw) => '.' + raw)

const TOTAL_CARDS = 24

export const Board_specs = describe('<Board />', () => {
  let sandbox
  let props

  beforeEach(() => {
    sandbox = sinon.sandbox.create()

    require('react-proptype-error-catcher')(sandbox)

    props = {
      cards: _.times(TOTAL_CARDS, (id) => ({
        id: String(id),
        image_name: String(Math.floor(id / 2)),
        show_front: false,
      })),
      my_turn: false,
      onCardSelect: sandbox.stub(),
    }
  })

  afterEach(() => {
    sandbox.restore()
  })

  describe('general', () => {
    it('with normal props it should render without errors', () => {
      const wrapper = shallow(<Board {...props} />)
      expect(wrapper).to.exist
    })
  })
  describe('behaviors', () => {
    it('when all cards are present only show Card components', () => {
      const wrapper = shallow(<Board {...props} />)
      expect(wrapper.find('Card')).to.have.length(TOTAL_CARDS)
      expect(wrapper.find('EmptyCardSpace')).to.not.exist
    })
    it('when one card is missing show all Cards and one EmptyCardSpace', () => {
      props.cards[1] = null
      const wrapper = shallow(<Board {...props} />)
      expect(wrapper.find('Card')).to.have.length(TOTAL_CARDS - 1)
      expect(wrapper.find('EmptyCardSpace')).to.have.length(1)
    })
    it('when my_turn is true assign onSelect handler to Card', () => {
      props.my_turn = false
      const wrapper = shallow(<Board {...props} />)

      expect(wrapper.find('Card').first(), 'no onSelect').to.not.have.prop('onSelect')

      wrapper.setProps({my_turn: true})
      expect(wrapper.find('Card').first(), 'now have').to.have.prop('onSelect')
      wrapper.find('Card').first().simulate('select', props.cards[0].id)
      expect(props.onCardSelect).to.be.calledWith(props.cards[0])
    })
  })
})
