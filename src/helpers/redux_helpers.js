import _ from 'lodash'

export const grep_matching_from_object = (pairs) => _.mapValues(pairs, (sel, name) => {
  if (_.isFunction(sel)) return sel
  let sub_name
  if (_.isArray(sel)) {
    sub_name = sel[1]
    sel = sel[0]
  }
  if (sel[name] == null) {
    console.error(`grep_matching_from_object could not find ${name} in ${Object.keys(sel)}`)
  }
  if (sub_name) {
    return (state) => sel[sub_name](state).name
  }
  return sel[name]
})
