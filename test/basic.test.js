'use babel'

import {assert} from 'chai'
import Grim from 'grim'

function deprecatedFunction () {
  Grim.deprecate("This function is deprecated! Please use `nonDeprecatedFunction()`")
}

describe('Basic Tests', () => {
  beforeEach(() => {
    global.atom = global.buildAtomEnvironment()
  })

  afterEach(() => {
    global.atom.destroy()
  })

  it('passes', () => {
    assert.equal(true, true)
  })

  it('fails', () => {
    assert.notInclude("test runner", "test")
  })

  describe("nested at one level", () => {
    describe("nested at two levels", () => {
      it('reports failures correctly', () => {
        assert.isAtLeast(4, 5)
      })
    })
  })

  it('marks missing it blocks as pending')

  it('reports deprecations', () => {
    assert.equal(true, true)
    Grim.deprecate("This has been deprecated!")
  })

  describe('with a second describe block', () => {
    it('fails synchronously when an assertion fails', () => {
      deprecatedFunction()
      deprecatedFunction()
      assert.equal(true, false)
      return new Promise(resolve => setTimeout(resolve, 5000))
    })
  })
})

describe('A Second Suite', () => {
  it('fails asynchronously when a rejected promise is returned', () => {
    assert.equal(10, 10)
    return new Promise((resolve, rej) => setTimeout(() => rej(new Error("Failure via rejected promise")), 1000))
  })
})
