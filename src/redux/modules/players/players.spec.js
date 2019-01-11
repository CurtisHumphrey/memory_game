import reducer, {
  actions,
  private_actions,
  selectors,
} from './players'
// import _ from 'lodash'

// import {firebase_actions, SPECIAL_VALUES} from 'redux_firebase'
import {setFirebaseRules, setFirebaseData, test_rules} from 'redux/test_helpers/firebase_rule_testing'

describe('players redux', () => {
  let sandbox
  let state
  let dispatch
  let getState

  before(() => {
    setFirebaseRules(require('firebase_rules'))
  })

  beforeEach(() => {
    sandbox = sinon.sandbox.create()
    dispatch = sandbox.stub()
    state = reducer(undefined, {})
    getState = () => state

    setFirebaseData({})
  })
  afterEach(() => {
    sandbox.restore()
  })

  it('should have this initial state', () => {
    state = reducer(undefined, {})
    expect(selectors.something(state)).to.exist
  })
  describe('private_actions', () => {
    it('should have ', () => {
      state = reducer(undefined, private_actions.something())
    })
  })
  describe('public actions - no firebase', () => {
    it('', () => {
      actions.something()(dispatch, getState)
    })
  })
  describe('public actions that work with firebase', () => {
    let database
    let firebase_key = 'key'
    beforeEach(() => {
      database = {}
      dispatch.returns({key: firebase_key})
    })
    afterEach(() => {
      test_rules({dispatch, database})
    })
  })
})
