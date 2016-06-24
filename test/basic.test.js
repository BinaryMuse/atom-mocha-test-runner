'use babel'

import {assert} from 'chai'
// const assert = require('assert')
// const assert = {
//   equal: (a, b) => null
// }

describe('Basic Tests', () => {
  it('works', () => {
    assert.equal(true, false)
    // throw new Error('omg')
  })
  it('works 2', () => {
    assert.equal(true, false)
  })
  it('works 3', () => {
    assert.equal(true, true)
  })
  describe("nested 2", () => {
    describe("nested 3", () => {
      it('works 4', () => {
        assert.equal(true, false)
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
  })

  describe('more stuff', () => {
    it('works 6', () => {
      assert.equal(true, false)
      return new Promise(resolve => setTimeout(resolve, 5000))
    })
  })
})

describe('A Second Suite', () => {
  it('fails', () => {
    assert.equal(10, 10)
    return new Promise((resolve, rej) => setTimeout(() => rej(new Error("omg?!?")), 1000))
  })
})
