import reducer, {
  actions,
  private_actions,
  selectors,
  ACTION_TYPES,
} from './game_management'
import _ from 'lodash'
import lolex from 'lolex'

import {firebase_actions, SPECIAL_VALUES} from 'redux_firebase'
import {setFirebaseRules, setFirebaseData, test_rules} from 'redux/test_helpers/firebase_rule_testing'

import get_shuffle_cards from 'redux/utils/get_shuffle_cards'

import {
  actions as cards_actions,
  selectors as cards_selectors,
} from '../cards_locations'

const TOTAL_CARDS = 24

describe('game_management redux', () => {
  let sandbox
  let state
  let dispatch
  let getState
  let clock

  function expect_player_switched (new_player) {
    expect(dispatch, 'expect player to be switched').to.be.calledWith(firebase_actions.set(new_player, {
      path: '/games/game_id/meta/active_player',
    }))
  }

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
    expect(selectors.game_id(state)).to.eql('')
    expect(selectors.game_joined(state)).to.eql(false)
    expect(selectors.active_player(state), 'active_player').to.eql('host')
    expect(selectors.which_player_is_me(state), 'which_player_is_me').to.eql('host')
  })
  describe('private_actions', () => {
    it('should have a update_meta that works for game_joined', () => {
      state = reducer(state, private_actions.update_meta({game_joined: 'new_id'}))
      expect(selectors.game_joined(state)).to.eql('new_id')
    })
    it('should have a update_meta that works for active_player', () => {
      state = reducer(state, private_actions.update_meta({active_player: 'friend'}))
      expect(selectors.active_player(state), 'active_player').to.eql('friend')
    })
    it('should have a set_game_id', () => {
      state = reducer(state, private_actions.set_game_id('game_id'))
      expect(selectors.game_id(state)).to.eql('game_id')
    })
    it('should have a am_spectator', () => {
      state = reducer(state, private_actions.am_spectator())
      expect(selectors.which_player_is_me(state), 'which_player_is_me').to.eql('spectator')
    })
  })
  describe('selectors', () => {
    it('if cards are in deck and am host then is_dealer is true', () => {
      let cards = []
      sandbox.stub(cards_selectors, 'dealer_deck').callsFake(() => cards)

      expect(selectors.is_dealer(state), 'is_dealer 1').to.be.false

      cards = _.map(get_shuffle_cards(TOTAL_CARDS))
      state = _.clone(state) // causes createSelector to recompute
      expect(selectors.is_dealer(state), 'is_dealer 2').to.be.true

      state = reducer(state, actions.am_friend())
      expect(selectors.is_dealer(state), 'is_dealer 3').to.be.false
    })
    it('if cards are not on board never my_turn', () => {
      const cards = get_shuffle_cards(TOTAL_CARDS)
      sandbox.stub(cards_selectors, 'dealer_deck').returns(_.map(cards))
      sandbox.stub(cards_selectors, 'matched_card_count').returns(0)

      expect(selectors.active_player(state), 'active_player').to.eql('host')
      expect(selectors.which_player_is_me(state), 'which_player_is_me').to.eql('host')
      expect(selectors.my_turn(state)).to.eql(false)
      expect(selectors.can_start_new_game(state), 'can_start_new_game').to.eql(false)
    })
    it('after cards on board if I am host and host is active my_turn is true', () => {
      sandbox.stub(cards_selectors, 'dealer_deck').returns([])
      sandbox.stub(cards_selectors, 'matched_card_count').returns(0)

      expect(selectors.active_player(state), 'active_player').to.eql('host')
      expect(selectors.which_player_is_me(state), 'which_player_is_me').to.eql('host')
      expect(selectors.my_turn(state)).to.eql(true)
      expect(selectors.can_start_new_game(state), 'can_start_new_game').to.eql(false)
    })
    it('if I am host and friend is active my_turn is false', () => {
      sandbox.stub(cards_selectors, 'dealer_deck').returns([])
      sandbox.stub(cards_selectors, 'matched_card_count').returns(0)

      state = reducer(state, private_actions.update_meta({active_player: 'friend'}))
      expect(selectors.my_turn(state)).to.eql(false)
      expect(selectors.can_start_new_game(state), 'can_start_new_game').to.eql(false)
    })
    it('if I am friend and friend is active my_turn is true', () => {
      sandbox.stub(cards_selectors, 'dealer_deck').returns([])
      sandbox.stub(cards_selectors, 'matched_card_count').returns(0)

      state = reducer(state, private_actions.update_meta({active_player: 'friend'}))
      state = reducer(state, actions.am_friend())
      expect(selectors.which_player_is_me(state), 'which_player_is_me').to.eql('friend')
      expect(selectors.my_turn(state)).to.eql(true)
      expect(selectors.can_start_new_game(state), 'can_start_new_game').to.eql(false)
    })
    it('when all board cards are gone it is neither person turn', () => {
      sandbox.stub(cards_selectors, 'dealer_deck').returns([])
      sandbox.stub(cards_selectors, 'matched_card_count').returns(TOTAL_CARDS)

      expect(selectors.active_player(state), 'active_player').to.eql('host')
      expect(selectors.which_player_is_me(state), 'which_player_is_me').to.eql('host')
      expect(selectors.my_turn(state)).to.eql(false)
    })
    it('when all board cards are gone and am host then can_start_new_game is true', () => {
      sandbox.stub(cards_selectors, 'dealer_deck').returns([])
      sandbox.stub(cards_selectors, 'matched_card_count').returns(TOTAL_CARDS)

      expect(selectors.active_player(state), 'active_player').to.eql('host')
      expect(selectors.which_player_is_me(state), 'which_player_is_me').to.eql('host')
      expect(selectors.can_start_new_game(state), 'can_start_new_game').to.eql(true)

      state = reducer(state, private_actions.update_meta({active_player: 'friend'}))
      state = reducer(state, actions.am_friend())
      expect(selectors.can_start_new_game(state), 'can_start_new_game').to.eql(false)
    })
  })
  describe('public actions - no firebase', () => {
    let cards
    beforeEach(() => {
      sandbox.stub(cards_actions, 'show_card').returns('show_card')
      sandbox.stub(cards_actions, 'hide_cards').returns('hide_cards')
      sandbox.stub(cards_actions, 'move_cards').returns('move_cards')

      state = reducer(state, private_actions.set_game_id('game_id'))

      cards = get_shuffle_cards(TOTAL_CARDS)
    })
    it('should have a deal_cards that moves each card to board with 100ms spacing', () => {
      cards = _.sortBy(cards, 'shuffle_order')
      const deal_order_cards = _.reverse(_.clone(cards))

      sandbox.stub(cards_selectors, 'dealer_deck').callsFake(() => cards)

      clock = lolex.install()
      const tick = 100
      actions.deal_cards()(dispatch, getState)
      deal_order_cards.forEach((card, index) => {
        expect(dispatch).calledWith('move_cards')
        expect(cards_actions.move_cards).to.have.callCount(index + 1)
        expect(cards_actions.move_cards.lastCall.args[0], index).to.eql([{
          id: card.id,
          new_location: 'board',
        }])
        cards = _.dropRight(cards, 1)
        clock.tick(tick)
      })
    })
    it('should have a am_friend', () => {
      state = reducer(undefined, actions.am_friend())
      expect(selectors.which_player_is_me(state), 'which_player_is_me').to.eql('friend')
    })
    describe('selecting cards', () => {
      beforeEach(() => {
        sandbox.stub(cards_selectors, 'board_cards').callsFake(() => _.map(cards))
        sandbox.stub(cards_selectors, 'matched_card_count').returns(0)
      })
      it('if just one selection should just call show_card', () => {
        actions.select_card({id: 'card_1'})(dispatch, getState)
        expect(dispatch).to.be.calledWith('show_card')
        expect(cards_actions.show_card).to.be.calledWith('card_1')
        expect(dispatch).to.be.not.calledWith('hide_cards')
      })
      it('if the two selections do not match call hide_cards after 1 second delay and switch_players', () => {
        clock = lolex.install()
        const tick = 1000

        cards.card_1.show_front = true
        actions.select_card(cards.card_2)(dispatch, getState)

        expect(cards.card_1.image_name).to.not.eql(cards.card_2.image_name)

        expect(dispatch).to.be.calledWith('show_card')
        expect(cards_actions.show_card).to.be.calledWith('card_2')

        expect(dispatch).to.be.not.calledWith('hide_cards')
        expect(dispatch).to.be.not.calledWith('switch_players')

        clock.tick(tick)
        expect(dispatch).to.be.calledWith('hide_cards')
        expect(cards_actions.hide_cards).to.be.calledWith([
          cards.card_1,
          cards.card_2,
        ])
        expect_player_switched('friend')
      })
      it('if the two selections do match call move_cards after 1 second deplay on both and switch_players', () => {
        clock = lolex.install()
        const tick = 1000

        state = reducer(state, private_actions.update_meta({active_player: 'friend'}))

        cards.card_1.show_front = true
        actions.select_card(cards.card_0)(dispatch, getState)

        expect(cards.card_1.image_name).to.eql(cards.card_0.image_name)

        expect(dispatch).to.be.calledWith('show_card')
        expect(cards_actions.show_card).to.be.calledWith('card_0')
        expect(dispatch).to.not.be.calledWith('move_cards')

        clock.tick(tick)
        expect(dispatch).to.be.not.calledWith('hide_cards')

        expect(dispatch).to.be.calledWith('move_cards')

        expect(cards_actions.move_cards).to.be.calledWith([
          {
            id: 'card_0',
            new_location: 'friend',
            completed_order: 0,
          },
          {
            id: 'card_1',
            new_location: 'friend',
            completed_order: 0,
          },
        ])
        expect_player_switched('host')
      })
      it('if a third selection is attempted do nothing', () => {
        cards.card_1.show_front = true
        cards.card_2.show_front = true
        actions.select_card({id: 'card_0'})(dispatch, getState)

        expect(dispatch).to.be.not.called
      })
    })
  })
  describe('public actions that work with firebase', () => {
    let database
    let firebase_key = 'key'
    beforeEach(() => {
      database = {}
      dispatch.returns({key: firebase_key})
      sandbox.stub(cards_actions, 'setup_cards').returns('setup_cards')
      sandbox.stub(cards_actions, 'listen_for_cards').returns('listen_for_cards')
    })
    afterEach(() => {
      test_rules({dispatch, database})
    })
    it('should have a join game', () => {
      actions.join_game('host_game_id')(dispatch, getState)

      expect(dispatch).to.be.calledWith(private_actions.set_game_id('host_game_id'))
      expect(dispatch).to.be.calledWith(firebase_actions.on({
        path: '/games/host_game_id/meta',
        update_action: ACTION_TYPES.update_meta,
      }))

      expect(dispatch).to.be.calledWith('listen_for_cards')
      expect(cards_actions.listen_for_cards(firebase_key))
    })
    it('should have a become_friend the sets flag if game_joined is false', () => {
      state = reducer(state, private_actions.set_game_id('game_id'))
      state = reducer(state, private_actions.update_meta({game_joined: false}))
      actions.become_friend()(dispatch, getState)
      expect(dispatch).to.be.calledWith(firebase_actions.set(true,
        { path: '/games/game_id/meta/game_joined' }
      ))
    })
    it('should have a become_friend the sets spectator if game_joined is true', () => {
      state = reducer(state, private_actions.set_game_id('game_id'))
      state = reducer(state, private_actions.update_meta({game_joined: true}))
      actions.become_friend()(dispatch, getState)
      expect(dispatch).to.be.not.calledWith(firebase_actions.set(
        true,
        { path: '/games/game_id/meta/game_joined' }
      ))
      expect(dispatch).to.be.calledWith(private_actions.am_spectator())
    })
    it('should have a new_game that creates a new entry in firebase', () => {
      actions.new_game()(dispatch, getState)

      const action = firebase_actions.push({
        created_at: SPECIAL_VALUES.TIMESTAMP,
        meta: {
          active_player: 'host',
        },
      }, {
        path: '/games',
      })

      expect(dispatch.firstCall.args[0]).to.be.have.properties({
        payload: action.payload,
        meta: action.meta,
      })

      expect(_.keys(dispatch.firstCall.args[0].payload.cards)).to.have.length(TOTAL_CARDS)

      expect(dispatch).to.be.calledWith(private_actions.set_game_id(firebase_key))
      expect(dispatch).to.be.calledWith(firebase_actions.on({
        path: `/games/${firebase_key}/meta`,
        update_action: ACTION_TYPES.update_meta,
      }))

      expect(dispatch).to.be.calledWith('listen_for_cards')
      expect(cards_actions.listen_for_cards(firebase_key))
    })
    it('should have a re_shuffle moves the cards back to the dealer', () => {
      actions.re_shuffle()(dispatch, getState)

      expect(dispatch).calledWith('setup_cards')
      expect(_.keys(cards_actions.setup_cards.firstCall.args[0])).to.have.length(TOTAL_CARDS)
    })
  })
})
