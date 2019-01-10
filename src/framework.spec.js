import assert from 'assert'

describe('(Framework) Karma Plugins', function () {
  it('Should expose "expect" globally.', function () {
    assert.ok(expect)
  })

  it('Should have chai-properties helpers.', function () {
    const subject = { a: 'a', b: 'b', c: 'c' }

    expect(subject).to.have.properties({ a: 'a' })
    expect(subject).to.have.properties({ a: 'a', b: 'b' })
    expect(subject).to.not.have.properties({ a: 'a', z: 'z' })
    expect(subject).to.not.have.properties({ a: '1' })
  })

  it('Should have chai-as-promised helpers.', function () {
    const pass = new Promise((resolve) => resolve('test'))
    const fail = new Promise((resolve, reject) => reject(new Error()))

    return Promise.all([
      expect(pass).to.be.fulfilled,
      expect(fail).to.not.be.fulfilled,
    ])
  })
})
