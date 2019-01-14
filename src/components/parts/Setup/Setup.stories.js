/* eslint no-magic-numbers: 0 */
/* eslint max-len: 0 */
import React from 'react'
import {knob, stories} from 'helpers/storybook_helpers'
// import _ from 'lodash'
// import faker from 'faker'
// import dayjs from 'dayjs'

stories('Parts', module)
  .spec_and_info(
    'Setup',
    {
      spec: require('./Setup.spec').Setup_specs,
      Component: require('./Setup').Setup,
      render: (Setup) => {
        return () => (
          <Setup
            game_id={knob.text('game_id', 'game_id')}
            which_player_is_me={knob.select('which_player_is_me', ['host', 'friend', 'spectator'], 'host')}
            game_joined={knob.boolean('game_joined', false)}
          />
        )
      },
    }
  )
