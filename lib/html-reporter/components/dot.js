'use babel'
/** @jsx etch.dom */

import etch from 'etch'

export default class Dot {
  constructor (props) {
    this.props = props
    etch.initialize(this)
  }

  update (props) {
    this.props = props
    etch.update(this)
  }

  render () {
    const {test} = this.props
    const state = test.pending ? 'pending' : test.state || 'waiting'
    return (
      <li className={`dot ${state}`} title={test.fullTitle()}>{"\u2b24"}</li>
    )
  }
}
