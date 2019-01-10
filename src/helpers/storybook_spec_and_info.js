import { withInfo } from '@storybook/addon-info'
import { specs } from 'storybook-addon-specifications'
import _ from 'lodash'

export default ({spec, Component, render}) => (context) => {
  specs(() => spec)
  if (_.isArray(Component.__docgenInfo)) {
    Component.__docgenInfo = Component.__docgenInfo[0]
  }
  return withInfo({
    header: true,
  })(render(Component))(context)
}
