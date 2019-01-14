import _ from 'lodash'

const PAIR = 2
export default function get_shuffle_cards (total) {
  let cards = _.times(total, (index) => ({
    id: `card_${index}`,
    image_name: String(Math.floor(index / PAIR)),
    show_front: false,
    location: 'dealer',
  }))

  return _.chain(cards)
    .shuffle()
    .map((card, index) => ({
      shuffle_order: index,
      ...card,
    }))
    .reduce((collection, card) => {
      collection[card.id] = card
      return collection
    }, {})
    .value()
}
