/* eslint no-magic-numbers: 0 */
/* eslint max-len: 0 */
import React from 'react'
import {knob, stories} from 'helpers/storybook_helpers'
import _ from 'lodash'
// import faker from 'faker'

const TOTAL_CARDS = 24

stories('Parts', module)
  .spec_and_info(
    'Pile',
    {
      spec: require('./Pile.spec').Pile_specs,
      Component: require('./Pile').Pile,
      render: (Pile) => {
        const show_front = knob.boolean('cards[].show_front', true)
        const cards = _.times(knob.number('# cards', 3, {range: true, min: 0, max:TOTAL_CARDS, step:1}), (id) => ({
          id: String(id),
          image_name: String(Math.floor(id / 2)),
          show_front,
        }))
        return () => (
          <Pile
            cards={cards}
          />
        )
      },
    }
  )
