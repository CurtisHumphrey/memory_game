import React from 'react'
import {
  shallow,
} from 'enzyme'
// import _ from 'lodash'

import {
  Fade,
} from './Fade'

import stylesClass from './Fade.scss'
// const styles = _.mapValues(stylesClass, (raw) => '.' + raw)

export const Fade_specs = describe('<Fade />', () => {
  let sandbox
  let props

  beforeEach(() => {
    sandbox = sinon.sandbox.create()

    require('react-proptype-error-catcher')(sandbox)

    props = {
      children: <div />,
    }
  })

  afterEach(() => {
    sandbox.restore()
  })

  describe('general', () => {
    it('with normal props it should render without errors', () => {
      const wrapper = shallow(<Fade {...props} />)
      expect(wrapper).to.exist
    })
  })
  describe('behaviors', () => {
    it('if given a child has className it should include it to the injected className', () => {
      props.children = <div className='test_name' />
      const wrapper = shallow(<Fade {...props} />)
      expect(wrapper.find('div')).to.have.className('test_name')
      expect(wrapper.find('div')).to.have.className(stylesClass.root)
    })
  })
})
