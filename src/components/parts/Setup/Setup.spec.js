import React from 'react'
import {
  shallow,
} from 'enzyme'
// import _ from 'lodash'

import {
  Setup,
} from './Setup'

// import stylesClass from './Setup.scss'
// const styles = _.mapValues(stylesClass, (raw) => '.' + raw)

export const Setup_specs = describe('<Setup />', () => {
  let sandbox
  let props

  beforeEach(() => {
    sandbox = sinon.sandbox.create()

    require('react-proptype-error-catcher')(sandbox)

    props = {
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
  })
  describe('behaviors', () => {
  })
})
