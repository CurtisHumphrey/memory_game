/* eslint no-magic-numbers: 0 */
/* eslint max-len: 0 */
import React from 'react'
import {knob, stories} from 'helpers/storybook_helpers'
// import _ from 'lodash'
// import faker from 'faker'
// import moment from 'moment'

stories('Animation', module)
  .spec_and_info(
    'Fade',
    {
      spec: require('./Fade.spec').Fade_specs,
      Component: require('./Fade').Fade,
      render: (Fade) => {
        return () => (
          <Fade
            in={knob.boolean('in', false)}
          >
            <div>Testing</div>
          </Fade>
        )
      },
    }
  )
