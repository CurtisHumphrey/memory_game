import { combineReducers } from 'redux'

export const inject_reducers = (reducer_map) => /* istanbul ignore next */ {
  const store = window.__STORE__
  store.asyncReducers = {
    ...store.asyncReducers,
    ...reducer_map,
  }
  if (__TEST__) store.asyncReducers = reducer_map

  const reducer = combineReducers(store.asyncReducers)
  store.replaceReducer(reducer)
  return reducer
}
