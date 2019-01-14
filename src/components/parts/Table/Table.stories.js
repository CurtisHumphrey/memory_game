/* eslint no-magic-numbers: 0 */
/* eslint max-len: 0 */
import React from 'react'
import {knob, stories} from 'helpers/storybook_helpers'
import _ from 'lodash'
// import faker from 'faker'
// import dayjs from 'dayjs'

const TOTAL_CARDS = 24

stories('Parts', module, {width: '100%', height: '100%'})
  .spec_and_info(
    'Table',
    {
      spec: require('./Table.spec').Table_specs,
      Component: require('./Table').Table,
      render: (Table) => {
        const cards = _.times(TOTAL_CARDS, (id) => ({
          id: String(id),
          image_name: String(Math.floor(id / 2)),
          show_front: false,
        }))
        return () => (
          <Table
            active_player={knob.boolean('active_player is host', true) ? 'host' : 'friend'}
            is_dealer={knob.boolean('is_dealer', true)}
            dealer_deck={cards}
            board_cards={cards}
            host_cards={cards}
            friend_cards={cards}
            select_card={knob.action('select_card')}
            deal_cards={knob.action('deal_cards')}
          />
        )
      },
    }
  )
