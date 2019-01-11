import reducer, {
  actions,
  private_actions,
  selectors,
  ACTION_TYPES,
} from './cards_locations'
import { get_shuffle_cards } from './cards_locations_simple'
import _ from 'lodash'

import {firebase_actions} from 'redux_firebase'
import {setFirebaseRules, setFirebaseData, test_rules} from 'redux/test_helpers/firebase_rule_testing'

const TOTAL_CARDS = 24

describe('cards_locations redux', () => {
  let sandbox
  let state
  let dispatch
  let getState
  let clock

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
    if (clock) clock.uninstall()
  })

  it('should have this initial state', () => {
    state = reducer(undefined, {})
    expect(selectors.game_id(state), 'game_id').to.eql('')
    expect(selectors.dealer_deck(state), 'dealer_deck').to.have.length(0)
    expect(selectors.board_cards(state), 'board_cards').to.have.length(0)
    expect(selectors.host_cards(state), 'host_cards').to.have.length(0)
    expect(selectors.friend_cards(state), 'friend_cards').to.have.length(0)
  })
  it('get_shuffle_cards should return a deck of cards', () => {
    expect(_.keys(get_shuffle_cards(TOTAL_CARDS))).to.have.length(TOTAL_CARDS)
  })
  describe('private_actions', () => {
    it('should have a set_game_id', () => {
      state = reducer(undefined, private_actions.set_game_id('game_id'))
      expect(selectors.game_id(state), 'game_id').to.eql('game_id')
    })
    it('should have update_cards that works for dealer', () => {
      const cards = get_shuffle_cards(TOTAL_CARDS)
      state = reducer(undefined, private_actions.update_cards(cards))

      expect(selectors.dealer_deck(state), 'dealer_deck').to.have.length(TOTAL_CARDS)
      expect(selectors.dealer_deck(state)[0], 'dealer_deck[0] in order').to.have.properties({
        shuffle_order: 0,
      })
      expect(selectors.board_cards(state), 'board_cards').to.have.length(TOTAL_CARDS)
      expect(selectors.board_cards(state)[0], 'board_cards[0]').to.equal(null)
      expect(selectors.host_cards(state), 'host_cards').to.have.length(0)
      expect(selectors.friend_cards(state), 'friend_cards').to.have.length(0)
    })
    it('should have update_cards that works for board', () => {
      const cards = _.mapValues(get_shuffle_cards(TOTAL_CARDS), (v) => Object.assign({}, v, {location: 'board'}))
      state = reducer(undefined, private_actions.update_cards(cards))

      expect(selectors.dealer_deck(state), 'dealer_deck').to.have.length(0)
      expect(selectors.board_cards(state), 'board_cards').to.have.length(TOTAL_CARDS)
      expect(selectors.board_cards(state)[0], 'board_cards[0]').to.not.eql(null)
      expect(selectors.host_cards(state), 'host_cards').to.have.length(0)
      expect(selectors.friend_cards(state), 'friend_cards').to.have.length(0)
    })
    it('should have update_cards that works for host', () => {
      const cards = _.mapValues(get_shuffle_cards(TOTAL_CARDS), (v) => Object.assign({}, v, {location: 'host'}))
      state = reducer(undefined, private_actions.update_cards(cards))

      expect(selectors.dealer_deck(state), 'dealer_deck').to.have.length(0)
      expect(selectors.board_cards(state), 'board_cards').to.have.length(TOTAL_CARDS)
      expect(selectors.board_cards(state)[0], 'board_cards[0]').to.eql(null)
      expect(selectors.host_cards(state), 'host_cards').to.have.length(TOTAL_CARDS)
      expect(selectors.friend_cards(state), 'friend_cards').to.have.length(0)
    })
    it('should have update_cards that works for friend', () => {
      const cards = _.mapValues(get_shuffle_cards(TOTAL_CARDS), (v) => Object.assign({}, v, {location: 'friend'}))
      state = reducer(undefined, private_actions.update_cards(cards))

      expect(selectors.dealer_deck(state), 'dealer_deck').to.have.length(0)
      expect(selectors.board_cards(state), 'board_cards').to.have.length(TOTAL_CARDS)
      expect(selectors.board_cards(state)[0], 'board_cards[0]').to.eql(null)
      expect(selectors.host_cards(state), 'host_cards').to.have.length(0)
      expect(selectors.friend_cards(state), 'friend_cards').to.have.length(TOTAL_CARDS)
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
    describe('loading', () => {
      it('should have a listen_for_cards that calls firebase/switch (1st no old_path)', () => {
        actions.listen_for_cards('game_id')(dispatch, getState)

        expect(dispatch).to.be.calledWith(private_actions.set_game_id('game_id'))
        expect(dispatch).to.be.calledWith(firebase_actions.switch({
          path: '/games/game_id/cards',
          old_path: '',
          update_action: ACTION_TYPES.update_cards,
        }))
      })
      it('should have a listen_for_cards that calls firebase/switch (2nd has old_path)', () => {
        state = reducer(state, private_actions.set_game_id('old_id'))
        actions.listen_for_cards('game_id')(dispatch, getState)

        expect(dispatch).to.be.calledWith(firebase_actions.switch({
          path: '/games/game_id/cards',
          old_path: '/games/old_id/cards',
          update_action: ACTION_TYPES.update_cards,
        }))
      })
    })
    describe('card movement', () => {
      beforeEach(() => {
        state = reducer(state, private_actions.set_game_id('game_id'))
        sandbox.stub(firebase_actions, 'set')
        sandbox.stub(firebase_actions, 'update')
      })

      it('should have a show_card that changes the card\'s show_front to true', () => {
        actions.show_card('card-1')(dispatch, getState)
        expect(firebase_actions.set).to.be.calledWith(
          true,
          { path: '/games/game_id/cards/card-1/show_front' }
        )
      })

      it('should have a hide_cards that changes the cards show_front to false', () => {
        actions.hide_cards([{id: 'card-1'}, {id: 'card-2'}])(dispatch, getState)
        expect(firebase_actions.update).to.be.calledWith(
          {
            'card-1/show_front': false,
            'card-2/show_front': false,
          },
          { path: '/games/game_id/cards/' }
        )
      })

      it('should have a move_card that changes location', () => {
        actions.move_card({id: 'card-2', new_location: 'board'})(dispatch, getState)
        expect(firebase_actions.update).to.be.calledWith(
          {
            location: 'board',
            completed_order: null,
          },
          { path: '/games/game_id/cards/card-2' }
        )
      })
      it('should have a move_card that can also update completed_order', () => {
        actions.move_card({id: 'card-2', new_location: 'board', completed_order: 1})(dispatch, getState)
        expect(firebase_actions.update).to.be.calledWith(
          {
            location: 'board',
            completed_order: 1,
          },
          { path: '/games/game_id/cards/card-2' }
        )
      })

      it('should have setup_cards that saves the cards', () => {
        const cards = get_shuffle_cards(TOTAL_CARDS)
        actions.setup_cards(cards)(dispatch, getState)
        expect(firebase_actions.set).to.be.calledWith(
          cards,
          { path: '/games/game_id/cards/' }
        )
      })
    })
  })
})
