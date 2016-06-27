'use babel'
/** @jsx etch.dom */

import etch from 'etch'

export default class Timer {
  constructor (props) {
    this.props = props
    etch.initialize(this)
    this.tick()
  }

  update (props) {
    this.props = props
    etch.update(this)
  }

  tick () {
    etch.update(this)
    requestAnimationFrame(() => this.tick())
  }

  render () {
    return <span>{this.formattedTime()}</span>
  }

  formattedTime () {
    const delta = Math.floor(this.props.ended || performance.now()) - this.props.started
    const seconds = (delta / 1000).toFixed(2)
    return `${seconds}s`
  }
}
