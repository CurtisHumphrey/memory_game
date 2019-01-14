import React from 'react'
import ReactDOM from 'react-dom'
import getStore from './store/getStore'
import { Provider } from 'react-redux'
import { ConnectedRouter } from 'connected-react-router'

import Routes from 'routes'
import './styles/core.scss'

// ========================================================
// Store Instantiation
// ========================================================
const store = getStore()

// ========================================================
// Render Setup
// ========================================================
const MOUNT_NODE = document.getElementById('root')

let render = () => {
  ReactDOM.render(
    <Provider store={store}>
      <ConnectedRouter history={store.history} >
        <Routes />
      </ConnectedRouter>
    </Provider>,
    MOUNT_NODE
  )
}

// This code is excluded from production bundle
if (__DEV__) {
  if (module.hot) {
    // Development render functions
    const renderApp = render
    const renderError = (error) => {
      const RedBox = require('redbox-react').default

      ReactDOM.render(<RedBox error={error} />, MOUNT_NODE)
    }

    // Wrap render in try/catch
    render = () => {
      try {
        renderApp()
      } catch (error) {
        renderError(error)
      }
    }

    // Setup hot module replacement
    module.hot.accept('./routes', () =>
      setImmediate(() => {
        ReactDOM.unmountComponentAtNode(MOUNT_NODE)
        render()
      })
    )
  }
}

// ========================================================
// Go!
// ========================================================
render()
