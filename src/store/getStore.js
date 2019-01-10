import createStore from './createStore.js'

// ========================================================
// Store Instantiation
// ========================================================
if (__TEST__) {
  window.__STORE__ = {
    asyncReducers: {},
    replaceReducer: () => {},
    dispatch: () => {},
  }
} else {
  const initialState = window.___INITIAL_STATE__
  window.__STORE__ = createStore(initialState)
}

export default () => window.__STORE__
