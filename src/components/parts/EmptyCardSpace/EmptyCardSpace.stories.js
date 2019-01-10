/* eslint no-magic-numbers: 0 */
/* eslint max-len: 0 */
import React from 'react'
import {stories} from 'helpers/storybook_helpers'
// import _ from 'lodash'
// import faker from 'faker'

stories('Parts', module)
  .spec_and_info(
    'EmptyCardSpace',
    {
      spec: require('./EmptyCardSpace.spec').EmptyCardSpace_specs,
      Component: require('./EmptyCardSpace').EmptyCardSpace,
      render: (EmptyCardSpace) => {
        return () => (
          <EmptyCardSpace />
        )
      },
    }
  )
