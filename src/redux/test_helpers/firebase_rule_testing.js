import targaryen from 'targaryen/plugins/chai'
import _ from 'lodash'

export function setFirebaseRules (rules) {
  targaryen.setFirebaseRules(rules)
}

export function setFirebaseData (data) {
  targaryen.setFirebaseData(data)
}

export const user_types = {
  unauthenticated: targaryen.users.unauthenticated,
  anonymous: targaryen.users.anonymous,
  active: targaryen.users.password,
  other: targaryen.users.google,
}

function read_check ({user, path, type, not}) {
  const can_type = not ? 'cannot' : 'can'

  expect(user, type)[can_type].read.path(path)
}
function write_check ({user, path, type, not, write}) {
  const can_type = not ? 'cannot' : 'can'

  expect(user, type)[can_type].write(write).path(path)
}

export function test_rules ({dispatch, user = user_types.active, database = {}, not = false}) {
  targaryen.setFirebaseData(database)

  dispatch.getCalls().forEach((call) => { // eslint-disable-line complexity
    const type = _.get(call, 'args[0].type')
    const payload = _.get(call, 'args[0].payload')
    const path = _.get(call, 'args[0].meta.path')
    const init_value = _.get(call, 'args[0].meta.init_value')

    switch (type) {
      case 'firebase/on':
      case 'firebase/once':
        read_check({user, not, path, type})
        if (init_value) {
          write_check({user, not, path, type, write: init_value})
        }
        break
      case 'firebase/switch':
        read_check({user, not, path, type})
        break
      case 'firebase/push':
        if (_.isEmpty(payload)) return // just creating id
        write_check({user, not, path, type, write: payload})
        break
      case 'firebase/set':
        write_check({user, not, path, type, write: payload})
        break
      case 'firebase/remove':
        write_check({user, not, path, type, write: null})
        break
      case 'firebase/update':
        if (not) {
          expect(user, 'firebase/update').cannot.patch(payload).to.path(path)
        } else {
          expect(user, 'firebase/update').can.patch(payload).to.path(path)
        }
        break
    }
  })
}
