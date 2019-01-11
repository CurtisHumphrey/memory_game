import { applyMiddleware, compose, createStore, combineReducers } from 'redux'
import thunk from 'redux-thunk'
import { connectRouter, routerMiddleware } from 'connected-react-router'
import createHistory from 'history/createBrowserHistory'
import { firebase_middleware, reducer as firebase } from 'redux_firebase'

const get_firebase_config = () => {
  return require('./firebase_config.prod').default
}

export default (initialState = {}) => /* istanbul ignore next */ {
  const browserHistory = createHistory()
  // ======================================================
  // Middleware Configuration
  // ======================================================

  const middleware = [
    thunk,
    firebase_middleware(get_firebase_config()),
    routerMiddleware(browserHistory),
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
