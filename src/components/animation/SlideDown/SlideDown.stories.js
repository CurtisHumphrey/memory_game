/* eslint no-magic-numbers: 0 */
/* eslint max-len: 0 */
import React from 'react'
import {knob, stories} from 'helpers/storybook_helpers'
// import _ from 'lodash'
// import faker from 'faker'
// import dayjs from 'dayjs'

stories('Animation', module)
  .spec_and_info(
    'SlideDown',
    {
      spec: require('./SlideDown.spec').SlideDown_specs,
      Component: require('./SlideDown').SlideDown,
      render: (SlideDown) => {
        return () => (
          <SlideDown
            in={knob.boolean('in', false)}
          >
            <div>Testing</div>
          </SlideDown>
        )
      },
    }
  )
