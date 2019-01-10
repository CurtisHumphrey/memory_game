import React from 'react'
import {
  shallow,
} from 'enzyme'
import _ from 'lodash'

import {
  Card,
  CardPose,
} from './Card'

import get_house_url from 'images/houses'

import stylesClass from './Card.scss'
const styles = _.mapValues(stylesClass, (raw) => '.' + raw)

export const Card_specs = describe('<Card />', () => {
  let sandbox
  let props

  beforeEach(() => {
    sandbox = sinon.sandbox.create()

    require('react-proptype-error-catcher')(sandbox)

    props = {
      id: 'id',
      image_name: '1',
      show_front: false,
      onSelect: sandbox.stub(),
    }
  })

  afterEach(() => {
    sandbox.restore()
  })

  describe('general', () => {
    it('with normal props it should render without errors', () => {
      const wrapper = shallow(<Card {...props} />)
      expect(wrapper).to.exist
    })
  })
  describe('behaviors', () => {
    it('should pass front to CardPose when show_front is true', () => {
      props.show_front = true
      const wrapper = shallow(<Card {...props} />)
      expect(wrapper.find(CardPose)).to.have.prop('pose').eql('front')
    })
    it('should pass back to CardPose when show_front is false', () => {
      props.show_front = false
      const wrapper = shallow(<Card {...props} />)
      expect(wrapper.find(CardPose)).to.have.prop('pose').eql('back')
    })
    it('should render image_name as img url', () => {
      const wrapper = shallow(<Card {...props} />)
      expect(wrapper.find('img')).to.have.prop('src').eql(get_house_url(props.image_name))
    })
    it('if show_front is false allow onSelect to return id', () => {
      props.show_front = false
      const wrapper = shallow(<Card {...props} />)
      wrapper.simulate('click')
      expect(wrapper.find(styles.clickable)).to.exist
      expect(props.onSelect).to.be.calledWith(props.id)
    })
    it('if show_front is false but no onSelect then not clickable and false', () => {
      props.show_front = false
      props.onSelect = undefined
      const wrapper = shallow(<Card {...props} />)
      wrapper.simulate('click')
      expect(wrapper.find(styles.clickable)).to.not.exist
    })
    it('if show_front is true do not allow onSelect to return', () => {
      props.show_front = true
      const wrapper = shallow(<Card {...props} />)
      wrapper.simulate('click')
      expect(wrapper.find(styles.clickable)).to.not.exist
      expect(props.onSelect).to.be.not.called
    })
  })
})
