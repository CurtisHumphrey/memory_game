import {
  default as createStore,
} from 'store/createStore'
import { routerReducer as routing } from 'react-router-redux'
import { reducer as firebase } from 'redux_firebase'

describe('(Store) createStore', () => {
  let store

  before(() => {
    store = createStore()
  })

  it('should have an asyncReducers object with just routing and firebase', () => {
    expect(store.asyncReducers).to.be.eql({
      routing,
      firebase,
    })
  })
})
