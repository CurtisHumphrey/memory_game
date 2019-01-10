import get_house_url from './houses'

describe('house images', () => {
  let sandbox

  beforeEach(() => {
    sandbox = sinon.sandbox.create()
    sandbox.stub(console, 'warn')
  })

  afterEach(() => {
    sandbox.restore()
  })

  it('if image name is invalid return empty string', () => {
    expect(get_house_url('invalid')).to.eql('')
    expect(console.warn).to.be.called
  })
  it('if image name is valid return string', () => {
    expect(get_house_url('1')).to.not.eql('')
    expect(console.warn).to.be.not.called
  })
})
