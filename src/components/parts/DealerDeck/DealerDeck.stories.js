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
    'DealerDeck',
    {
      spec: require('./DealerDeck.spec').DealerDeck_specs,
      Component: require('./DealerDeck').DealerDeck,
      render: (DealerDeck) => {
        const cards = _.times(TOTAL_CARDS, (id) => ({
          id: String(id),
          image_name: String(Math.floor(id / 2)),
          show_front: false,
        }))
        return () => (
          <DealerDeck
            cards={knob.boolean('has cards', true) ? cards : []}
            is_dealer={knob.boolean('is_dealer', true)}
            game_joined={knob.boolean('game_joined', false)}
            can_start_new_game={knob.boolean('can_start_new_game', false)}
            onDeal={knob.action('onDeal')}
            onReshuffle={knob.action('onReshuffle')}
          />
        )
      },
    }
  )
