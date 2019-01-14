/* eslint no-magic-numbers: 0 */
/* eslint max-len: 0 */
import React from 'react'
import {knob, stories} from 'helpers/storybook_helpers'
import {all_names} from 'images/houses'
// import _ from 'lodash'
// import faker from 'faker'

stories('Parts', module)
  .spec_and_info(
    'Card',
    {
      spec: require('./Card.spec').Card_specs,
      Component: require('./Card').Card,
      render: (Card) => {
        return () => (
          <Card
            id={knob.text('id', 'id')}
            image_name={knob.select('image_name', all_names, all_names[0])}
            show_front={knob.boolean('show_front', false)}
            onSelect={knob.boolean('has onSelect', true) ? knob.action('onSelect') : undefined}
          />
        )
      },
    }
  )
