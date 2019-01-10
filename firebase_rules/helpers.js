import _ from 'lodash'

// logic blocks
export const and = (conditions) => {
  if (conditions.length === 0) return undefined
  return conditions.map((c) => `(${c})`).join(' && ')
}
export const or = (conditions) => {
  if (conditions.length === 0) return undefined
  return conditions.map((c) => `(${c})`).join(' || ')
}

// assertion blocks
export const is_a_user = () => "auth !== null && auth.provider !== 'anonymous'"
export const create_only = () => 'newData.exists() && !data.exists()'
export const no_removing = () => 'newData.exists()'
export const is_admin = () => "root.child('users/public').child(auth.uid).child('is_admin').val()==true"
export const path_key_is_me = (key = '$chef_id') => `${key} === auth.uid`

// helper blocks
export const is_enum = (enums) => (data) => or(enums.map((e) => `${data}.val() === '${e}'`))
export const the_child = (name, data = 'newData') => `${data}.child('${name}')`
export const has_children = (children) => `newData.hasChildren(['${children.join("', '")}'])`

export const children_validates = (children) => and([
  has_children(_.keys(children)),
  ..._.map(children, (rule, key) => _.isFunction(rule) ? rule(the_child(key), the_child(key, 'data')) : rule),
])

// Value Rule
// basic format when used in children_validates: func (new_val, old_val) => 'rule string' OR 'rule string'
// children_validates takes care of getting the child value and using it for new_val and old_val
export const id_is_path_key = (path_key) => (new_val) => `${path_key} === ${new_val}.val()`

export const is_auth_id = (val = 'newData') => `${val}.val() === auth.uid`
export const is_and_was_auth_id = (new_val, old_val) => and([
  is_auth_id(new_val),
  or([
    '!data.exists()',
    is_auth_id(old_val),
  ]),
])
export const is_current_timestamp = (val = 'newData') => `${val}.val() <= now`
export const is_datetime = (val = 'newData') => `${val}.isNumber()`
