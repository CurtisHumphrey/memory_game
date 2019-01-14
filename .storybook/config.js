import { configure } from '@storybook/react'
import { setOptions } from '@storybook/addon-options'
import { describe, it, beforeEach, afterEach } from 'storybook-addon-specifications'

import '../framework/testing/chai_setup'

window.describe = describe
window.it = it
window.beforeEach = beforeEach
window.afterEach = afterEach

window.__STORE__ = {
  asyncReducers: {},
  replaceReducer: () => {},
  dispatch: () => {},
}

setOptions({
  name: 'Memory Storybook',
})

function loadStories () {
  const req = require.context('../src/components', true, /.stories.js$/)
  req.keys().forEach((filename) => req(filename))
}

configure(loadStories, module)
