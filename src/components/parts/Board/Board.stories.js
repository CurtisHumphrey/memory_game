/* eslint no-magic-numbers: 0 */
/* eslint max-len: 0 */
import React from 'react'
import {knob, stories} from 'helpers/storybook_helpers'
import _ from 'lodash'
// import faker from 'faker'

const TOTAL_CARDS = 24

stories('Parts', module, {width: '100%', height: '100%'})
  .spec_and_info(
    'Board',
    {
      spec: require('./Board.spec').Board_specs,
      Component: require('./Board').Board,
      render: (Board) => {
        const cards = _.times(TOTAL_CARDS, (id) => ({
          id: String(id),
          image_name: String(Math.floor(id / 2)),
          show_front: false,
        }))
        if (knob.boolean('one removed', false)) {
          cards[1] = null
        }

        return () => (
          <Board
            cards={cards}
            onCardSelect={knob.action('onCardSelect')}
          />
        )
      },
    }
  )
