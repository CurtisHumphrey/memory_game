const pictures = {}
const all_requires = require.context('.', false, /.*\.jpg/)
all_requires.keys().forEach((name) => {
  // remove ./ and .svg
  pictures[name.slice(2, -4)] = all_requires(name) // eslint-disable-line no-magic-numbers
})

export const all_names = Object.keys(pictures)

export default (name) => {
  const path = pictures[name]
  if (!path) {
    console.warn(`missing house ${name}`)
    return ''
  }
  return path
}
