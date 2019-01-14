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
      onDeal: sandbox.stub(),
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
      expect(wrapper.find('button')).to.exist
    })
    it('if is_dealer is false hide button', () => {
      props.is_dealer = false
      const wrapper = shallow(<DealerDeck {...props} />)
      expect(wrapper.find('button')).to.not.exist
    })
  })
})
