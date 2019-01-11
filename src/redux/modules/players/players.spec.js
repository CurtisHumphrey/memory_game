import reducer, {
  actions,
  private_actions,
  selectors,
  ACTION_TYPES,
} from './players'
// import _ from 'lodash'

import {firebase_actions} from 'redux_firebase'
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
    expect(selectors.active_player(state), 'active_player').to.eql('host')
    expect(selectors.host_name(state), 'host_name').to.eql('')
    expect(selectors.friend_name(state), 'friend_name').to.eql('')
    expect(selectors.which_player_is_me(state), 'which_player_is_me').to.eql('host')
    expect(selectors.game_id(state), 'game_id').to.eql('')
  })
  describe('private_actions', () => {
    it('should have a set_game_id', () => {
      state = reducer(undefined, private_actions.set_game_id('game_id'))
      expect(selectors.game_id(state), 'game_id').to.eql('game_id')
    })
    it('should have update_info', () => {
      state = reducer(undefined, private_actions.update_info({
        active_player: 'friend',
      }))
      expect(selectors.active_player(state), 'active_player').to.eql('friend')
      expect(selectors.host_name(state), 'host_name').to.eql('')
      expect(selectors.friend_name(state), 'friend_name').to.eql('')
    })
  })
  describe('public actions - no firebase', () => {
    it('should have a am_friend', () => {
      state = reducer(undefined, actions.am_friend())
      expect(selectors.which_player_is_me(state), 'which_player_is_me').to.eql('friend')
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
    describe('simple actions', () => {
      beforeEach(() => {
        state = reducer(state, private_actions.set_game_id('game_id'))
      })
      it('should have a switch_players', () => {
        expect(selectors.active_player(state), 'active_player').to.eql('host')
        actions.switch_players()(dispatch, getState)
        expect(dispatch).to.be.calledWith(firebase_actions.set(
          'friend',
          { path: '/games/game_id/players/active_player' }
        ))
      })
      it('should have a set_name if am host', () => {
        expect(selectors.which_player_is_me(state), 'which_player_is_me').to.eql('host')
        actions.set_name('curtis')(dispatch, getState)
        expect(dispatch).to.be.calledWith(firebase_actions.set(
          'curtis',
          { path: '/games/game_id/players/host_name' }
        ))
      })
      it('should have a set_name if am friend', () => {
        state = reducer(state, actions.am_friend())
        expect(selectors.which_player_is_me(state), 'which_player_is_me').to.eql('friend')
        actions.set_name('curtis')(dispatch, getState)
        expect(dispatch).to.be.calledWith(firebase_actions.set(
          'curtis',
          { path: '/games/game_id/players/friend_name' }
        ))
      })
    })

    describe('loading', () => {
      it('should have a listen_for_players that calls firebase/switch (1st no old_path)', () => {
        actions.listen_for_players('game_id')(dispatch, getState)

        expect(dispatch).to.be.calledWith(private_actions.set_game_id('game_id'))
        expect(dispatch).to.be.calledWith(firebase_actions.switch({
          path: '/games/game_id/players',
          old_path: '',
          update_action: ACTION_TYPES.update_players,
        }))
      })
      it('should have a listen_for_players that calls firebase/switch (2nd has old_path)', () => {
        state = reducer(state, private_actions.set_game_id('old_id'))
        actions.listen_for_players('game_id')(dispatch, getState)

        expect(dispatch).to.be.calledWith(firebase_actions.switch({
          path: '/games/game_id/players',
          old_path: '/games/old_id/players',
          update_action: ACTION_TYPES.update_players,
        }))
      })
    })
  })
})
