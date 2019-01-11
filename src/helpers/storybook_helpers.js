/* eslint no-magic-numbers: 0 */
/* eslint react/prop-types: 0 */
/* eslint max-len: 0 */
import React from 'react'
import { host } from 'storybook-host'
import { storiesOf } from '@storybook/react'
import { action } from '@storybook/addon-actions'
import * as knobs from '@storybook/addon-knobs'
import storybook_spec_and_info from 'helpers/storybook_spec_and_info'
import { MemoryRouter } from 'react-router'

import '../styles/core.scss'

export const knob = {
  action,
  ...knobs,
}

export const stories = (story_name, mod, size) => {
  const storybook = storiesOf(story_name, mod)
    .addDecorator(knobs.withKnobs)
    .addDecorator(host({
      background: '#FFF',
      backdrop: '#EBDED3', // $color_highlight_second_tint
      width: 350,
      height: 650,
      ...size,
    }))
    .addDecorator((getStory) => (
      <MemoryRouter>
        {getStory()}
      </MemoryRouter>
    ))

  const r_obj = {
    spec_and_info: (name, parts) => {
      storybook.add(name, storybook_spec_and_info(parts))
    },
  }

  return r_obj
}
