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

  describe('diffing', () => {
    it('single-line strings', () => {
      assert.strictEqual('aaa bbb ccc', 'aaa zzz ccc')
    })

    it('multi-line strings', () => {
      assert.strictEqual('abc\ndef\nghi\n', 'abc\nzzz\nghi\n')
    })

    it('objects', () => {
      assert.deepEqual(
        {a: 10, b: 'bbb', c: { ca: 'string before', cb: 'unchanged' }},
        {a: 10, b: 'zzz', c: { ca: 'string after', cb: 'unchanged' }},
      )
    })

    it('arrays', () => {
      assert.deepEqual(
        [1, 2, 'aaa', 6, 7, 100, {a: 10}, 8, 9],
        [1, 2, 'bbb', 6, 7, 8, {a: 40}, 8, 9],
      )
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
