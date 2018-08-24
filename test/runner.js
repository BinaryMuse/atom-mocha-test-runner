'use babel'

import {createRunner} from '../'

module.exports = createRunner({
  globalAtom: false,
  htmlTitle: "atom-mocha-test-runner tests"
}, (mocha, {terminate}) => {
  if (process.env.ATOM_MOCHA_TERMINATE === 'true') {
    console.log('Terminating test suite as requested.')
    terminate()
  }
})
