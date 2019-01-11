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

import {
  actions as players_actions,
  selectors as players_selectors,
} from '../players'

const TOTAL_CARDS = 24

describe('game_management redux', () => {
  let sandbox
  let state
  let dispatch
  let getState
  let clock

  function expect_phase_sent (phase) {
    expect(dispatch, 'phase to be sent').to.be.calledWith(firebase_actions.set(phase, {
      path: '/games/game_id/meta/phase',
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
    expect(selectors.phase(state)).to.eql('setup')
    expect(selectors.game_id(state)).to.eql('')
    expect(selectors.next_game_id(state)).to.eql('')
  })
  describe('private_actions', () => {
    it('should have a update_meta that works for phase', () => {
      state = reducer(state, private_actions.update_meta({phase: 'dealer'}))
      expect(selectors.phase(state)).to.eql('dealer')
    })
    it('should have a update_meta that works for next_game_id', () => {
      state = reducer(state, private_actions.update_meta({next_game_id: 'new_id'}))
      expect(selectors.next_game_id(state)).to.eql('new_id')
    })
    it('should have a set_game_id', () => {
      state = reducer(state, private_actions.set_game_id('game_id'))
      expect(selectors.game_id(state)).to.eql('game_id')
    })
  })
  describe('public actions - no firebase', () => {
    let cards
    beforeEach(() => {
      sandbox.stub(cards_actions, 'show_card').returns('show_card')
      sandbox.stub(cards_actions, 'hide_cards').returns('hide_cards')
      sandbox.stub(cards_actions, 'move_card').returns('move_card')
      sandbox.stub(players_actions, 'switch_players').returns('switch_players')
      sandbox.stub(players_selectors, 'active_player').returns('host')

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
        expect(dispatch).calledWith('move_card')
        expect(cards_actions.move_card).to.have.callCount(index + 1)
        expect(cards_actions.move_card.lastCall.args[0], index).to.eql({
          id: card.id,
          new_location: 'board',
        })
        cards = _.dropRight(cards, 1)
        clock.tick(tick)
      })

      expect_phase_sent('playing')
    })
    describe('selecting cards', () => {
      beforeEach(() => {
        sandbox.stub(cards_selectors, 'board_cards').callsFake(() => _.map(cards))
      })
      it('if just one selection should just call show_card', () => {
        actions.select_card({id: 'card_1'})(dispatch, getState)
        expect(dispatch).to.be.calledWith('show_card')
        expect(cards_actions.show_card).to.be.calledWith('card_1')
        expect(dispatch).to.be.not.calledWith('hide_cards')
        expect(dispatch).to.be.not.calledWith('switch_players')
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
        expect(dispatch).to.be.calledWith('switch_players')
      })
      it('if the two selections do match call move_card on both and switch_players', () => {
        cards.card_1.show_front = true
        actions.select_card(cards.card_0)(dispatch, getState)

        expect(cards.card_1.image_name).to.eql(cards.card_0.image_name)

        expect(dispatch).to.be.calledWith('show_card')
        expect(cards_actions.show_card).to.be.calledWith('card_0')

        expect(dispatch).to.be.not.calledWith('hide_cards')

        expect(dispatch).to.be.calledWith('move_card')

        expect(cards_actions.move_card).to.be.calledWith({
          id: 'card_0',
          location: 'host',
          completed_order: 0,
        })
        expect(cards_actions.move_card).to.be.calledWith({
          id: 'card_1',
          location: 'host',
          completed_order: 0,
        })
        expect(dispatch).to.be.calledWith('switch_players')
      })
      it('if a third selection is attempted do nothing', () => {
        cards.card_1.show_front = true
        cards.card_2.show_front = true
        actions.select_card({id: 'card_0'})(dispatch, getState)

        expect(dispatch).to.be.not.called
      })
      it('if all cards selected change phase to finished', () => {
        const empty_board = _.map(cards, () => null)
        empty_board[0] = cards.card_0
        empty_board[1] = cards.card_1
        cards.card_0.show_front = true
        cards = empty_board

        actions.select_card(empty_board[1])(dispatch, getState)
        expect_phase_sent('finished')
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
      sandbox.stub(players_actions, 'listen_for_players').returns('listen_for_players')
    })
    afterEach(() => {
      test_rules({dispatch, database})
    })
    it('should have a new_game that creates a new entry in firebase', () => {
      actions.new_game()(dispatch, getState)

      expect(dispatch.firstCall).to.be.calledWith(firebase_actions.push({
        created_at: SPECIAL_VALUES.TIMESTAMP,
        meta: {
          phase: 'setup',
        },
      }, {
        path: '/games',
      }))

      expect(dispatch).to.be.calledWith(private_actions.set_game_id(firebase_key))
      expect(dispatch).to.be.calledWith(firebase_actions.switch({
        path: `/games/${firebase_key}/meta`,
        old_path: '',
        update_action: ACTION_TYPES.update_meta,
      }))

      expect(dispatch).to.be.calledWith('listen_for_cards')
      expect(cards_actions.listen_for_cards(firebase_key))

      expect(dispatch).to.be.calledWith('listen_for_players')
      expect(players_actions.listen_for_players(firebase_key))

      expect(dispatch).calledWith('setup_cards')
      expect(_.keys(cards_actions.setup_cards.firstCall.args[0])).to.have.length(TOTAL_CARDS)

      expect(dispatch, 'phase to be sent').to.be.calledWith(firebase_actions.set('dealer', {
        path: `/games/${firebase_key}/meta/phase`,
      }))
    })
    it('should have a new_game call a second time set next_game_id', () => {
      state = reducer(state, private_actions.set_game_id('old_id'))
      actions.new_game()(dispatch, getState)

      expect(dispatch).to.be.calledWith(firebase_actions.switch({
        path: `/games/${firebase_key}/meta`,
        old_path: '/games/old_id/meta',
        update_action: ACTION_TYPES.update_meta,
      }))

      expect(dispatch, 'next_game_id to be sent to old_id').to.be.calledWith(firebase_actions.set(firebase_key, {
        path: '/games/old_id/meta/next_game_id',
      }))
    })
  })
})
