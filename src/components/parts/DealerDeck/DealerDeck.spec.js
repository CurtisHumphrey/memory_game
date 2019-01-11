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
      can_deal: true,
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
    it('if can_deal is true display button', () => {
      props.can_deal = true
      const wrapper = shallow(<DealerDeck {...props} />)
      expect(wrapper.find('button')).to.exist
    })
    it('if can_deal is false hide button', () => {
      props.can_deal = false
      const wrapper = shallow(<DealerDeck {...props} />)
      expect(wrapper.find('button')).to.not.exist
    })
  })
})
