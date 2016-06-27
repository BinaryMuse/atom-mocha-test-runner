'use babel'

import {assert} from 'chai'
import Grim from 'grim'

function deprecatedFunction () {
  Grim.deprecate("This function is deprecated! Please use `nonDeprecatedFunction()`")
}

describe('Basic Tests', () => {
  it('works', () => {
    assert.equal(true, true)
    // throw new Error('omg')
  })
  it('works 2', () => {
    assert.notInclude("test runner", "test")
  })
  it('works 3', (done) => {
    assert.equal(true, true)
  })
  describe("nested 2", () => {
    describe("nested 3", () => {
      it('works 4', () => {
        assert.isAtLeast(4, 5)
      })
    })
  })
  it('does more stuff yay')
  it('works 5', () => {
    assert.equal(true, true)
    assert.equal(true, true)
    assert.equal(true, true)
    assert.equal(true, true)
    assert.equal(true, true)
    assert.equal(true, true)
    assert.equal(true, true)
    assert.equal(true, true)
    assert.equal(true, true)
    assert.equal(true, true)
    assert.equal(true, true)
    assert.equal(true, true)
  })
  it('works 6', () => {
    assert.equal(true, true)
    Grim.deprecate("This has been deprecated!")
  })

  describe('more stuff', () => {
    it('works 6', () => {
      deprecatedFunction()
      deprecatedFunction()
      assert.equal(true, false)
      return new Promise(resolve => setTimeout(resolve, 5000))
    })
  })
})

describe('A Second Suite', () => {
  it('fails', () => {
    assert.equal(10, 10)
    return new Promise((resolve, rej) => setTimeout(() => rej(new Error("Failure via rejected promise")), 1000))
  })
})
