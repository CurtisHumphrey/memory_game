import sinon from 'sinon'
import chai from 'chai'

import Enzyme from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
Enzyme.configure({ adapter: new Adapter() })
chai.use(require('chai-enzyme')())

// lolex fix
// https://github.com/sinonjs/lolex/issues/136#issue-269351675
import lolex from 'lolex'
const org_install = lolex.install
lolex.install = (options) => { /* istanbul ignore next */
  return org_install({
    toFake: ['setTimeout', 'clearTimeout', 'setImmediate', 'clearImmediate', 'setInterval', 'clearInterval', 'Date'],
    ...options,
  })
}

chai.use(require('sinon-chai'))
chai.use(require('chai-as-promised'))
chai.use(require('chai-properties'))

global.chai = chai
global.sinon = sinon
global.expect = chai.expect

export default chai
