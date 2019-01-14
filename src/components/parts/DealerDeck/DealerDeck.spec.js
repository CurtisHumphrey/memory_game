import React from 'react'
import {
  shallow,
} from 'enzyme'
// import _ from 'lodash'

import {
  DealerDeck,
} from './DealerDeck'

// import stylesClass from './DealerDeck.scss'
// const styles = _.mapValues(stylesClass, (raw) => '.' + raw)

export const DealerDeck_specs = describe('<DealerDeck />', () => {
  let sandbox
  let props

  beforeEach(() => {
    sandbox = sinon.sandbox.create()

    require('react-proptype-error-catcher')(sandbox)

    props = {
      cards: [],
      is_dealer: true,
      game_joined: false,
      can_start_new_game: false,
      onDeal: sandbox.stub(),
      onReshuffle: sandbox.stub(),
    }
  })

  afterEach(() => {
    sandbox.restore()
  })

  describe('general', () => {
    it('with normal props it should render without errors', () => {
      const wrapper = shallow(<DealerDeck {...props} />)
      expect(wrapper).to.exist
    })
  })
  describe('behaviors', () => {
    it('if is_dealer is true display button', () => {
      props.is_dealer = true
      const wrapper = shallow(<DealerDeck {...props} />)
      expect(wrapper.find('button')).to.include.text('Deal')
    })
    it('if is_dealer is true but game_joined is false disable display button', () => {
      props.is_dealer = true
      props.game_joined = false
      const wrapper = shallow(<DealerDeck {...props} />)
      expect(wrapper.find('button')).to.have.prop('disabled').to.eql(true)

      wrapper.setProps({game_joined: true})
      expect(wrapper.find('button')).to.have.prop('disabled').to.eql(false)
    })
    it('if is_dealer is false hide button', () => {
      props.is_dealer = false
      const wrapper = shallow(<DealerDeck {...props} />)
      expect(wrapper.find('button')).to.not.exist
    })
    it('when can_start_new_game is true show new game button', () => {
      props.can_start_new_game = false
      props.is_dealer = false
      const wrapper = shallow(<DealerDeck {...props} />)
      expect(wrapper.find('button')).to.not.exist

      wrapper.setProps({can_start_new_game: true})
      expect(wrapper.find('button')).to.include.text('New Game')
    })
  })
})
