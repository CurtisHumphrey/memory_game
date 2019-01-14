/* eslint no-magic-numbers: 0 */
/* eslint max-len: 0 */
import React from 'react'
import {knob, stories} from 'helpers/storybook_helpers'
import _ from 'lodash'
// import faker from 'faker'
// import dayjs from 'dayjs'

const TOTAL_CARDS = 24

stories('Parts', module)
  .spec_and_info(
    'PlayerWinnings',
    {
      spec: require('./PlayerWinnings.spec').PlayerWinnings_specs,
      Component: require('./PlayerWinnings').PlayerWinnings,
      render: (PlayerWinnings) => {
        const cards = _.times(knob.number('# cards', 3, {range: true, min: 0, max:TOTAL_CARDS, step:1}), (id) => ({
          id: String(id),
          image_name: String(Math.floor(id / 2)),
          show_front: true,
        }))
        return () => (
          <PlayerWinnings
            name={knob.text('name', 'host')}
            on_left={knob.boolean('on_left', true)}
            is_active={knob.boolean('is_active', true)}
            cards={cards}
          />
        )
      },
    }
  )
