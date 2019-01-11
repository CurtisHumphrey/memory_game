import {
  default as createStore,
} from 'store/createStore'

describe('(Store) createStore', () => {
  let store

  before(() => {
    store = createStore()
  })

  it('should have an asyncReducers object with just router and firebase', () => {
    expect(store.asyncReducers).to.have.keys([
      'router',
      'firebase',
    ])
  })
})
