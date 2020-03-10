import { applyMiddleware, compose, createStore, combineReducers } from 'redux'
import thunk from 'redux-thunk'
import { connectRouter, routerMiddleware } from 'connected-react-router'
import createHistory from 'history/createBrowserHistory'
import { firebase_middleware, reducer as firebase } from 'redux_firebase'
import LogRocket from 'logrocket'
import setupLogRocketReact from 'logrocket-react'

const get_firebase_config = () => {
  return require('./firebase_config.prod').default
}

export default (initialState = {}) => /* istanbul ignore next */ {
  const browserHistory = createHistory()

  LogRocket.init('xnvior/memory-game', {
    release: __VERSION__,
  })
  try {
    setupLogRocketReact(LogRocket)
  } catch (error) {
    console.warn('logrocket setup failure')
    console.warn(error)
  }

  // ======================================================
  // Middleware Configuration
  // ======================================================

  const middleware = [
    thunk,
    firebase_middleware(get_firebase_config()),
    routerMiddleware(browserHistory),
    LogRocket.reduxMiddleware(),
  ]

  // ======================================================
  // Store Enhancers
  // ======================================================
  const enhancers = []
  const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose

  // ======================================================
  // Store Instantiation and HMR Setup
  // ======================================================
  const init_reducers = {
    version: () => __VERSION__,
    router: connectRouter(browserHistory),
    firebase,
  }
  const store = createStore(
    combineReducers(init_reducers),
    initialState,
    composeEnhancers(
      applyMiddleware(...middleware),
      ...enhancers
    )
  )
  store.asyncReducers = init_reducers
  store.history = browserHistory

  return store
}
