import React from 'react'
import {
  shallow,
} from 'enzyme'
import _ from 'lodash'

import {
  PlayerWinnings,
} from './PlayerWinnings'

import stylesClass from './PlayerWinnings.scss'
const styles = _.mapValues(stylesClass, (raw) => '.' + raw)

export const PlayerWinnings_specs = describe('<PlayerWinnings />', () => {
  let sandbox
  let props

  beforeEach(() => {
    sandbox = sinon.sandbox.create()

    require('react-proptype-error-catcher')(sandbox)

    props = {
      name: 'Curtis',
      cards: [],
      is_active: false,
      on_left: false,
    }
  })

  afterEach(() => {
    sandbox.restore()
  })

  describe('general', () => {
    it('with normal props it should render without errors', () => {
      const wrapper = shallow(<PlayerWinnings {...props} />)
      expect(wrapper).to.exist
    })
  })
  describe('behaviors', () => {
    it('if there are no cards do not display a score', () => {
      const wrapper = shallow(<PlayerWinnings {...props} />)
      expect(wrapper.find(styles.score)).to.not.exist
    })
    it('if there are cards do display a score', () => {
      const PAIR = 2
      props.cards = _.times(PAIR, (id) => ({
        id: String(id),
        image_name: String(Math.floor(id / PAIR)),
        show_front: true,
      }))
      const wrapper = shallow(<PlayerWinnings {...props} />)
      expect(wrapper.find(styles.score)).to.include.text(1)
    })
    it('if is_active is false do not display token', () => {
      props.is_active = false
      const wrapper = shallow(<PlayerWinnings {...props} />)
      expect(wrapper.find(styles.active)).to.not.exist
    })
    it('if is_active display on left by default', () => {
      props.is_active = true
      props.on_left = false
      const wrapper = shallow(<PlayerWinnings {...props} />)
      expect(wrapper.find(styles.active)).to.has.className(stylesClass.left)
    })
    it('if is_active display on right when on_left is true', () => {
      props.is_active = true
      props.on_left = true
      const wrapper = shallow(<PlayerWinnings {...props} />)
      expect(wrapper.find(styles.active)).to.has.className(stylesClass.right)
    })
  })
})
