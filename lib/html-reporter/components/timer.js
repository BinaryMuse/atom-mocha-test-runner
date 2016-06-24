'use babel'
/** @jsx etch.dom */

import etch from 'etch'

export default class Timer {
  constructor (props) {
    this.props = props
    this.state = {
      endTime: null
    }
    this.startStop(false, this.props.running)
    etch.initialize(this)
  }

  update (props) {
    this.startStop(this.props.running, props.running)
    this.props = props
    etch.update(this)
  }

  startStop (oldRunning, newRunning) {
    if (!oldRunning && newRunning) {
      this.tick(true)
    } else if (oldRunning && !newRunning) {
      this.state.endTime = performance.now()
    }
  }

  tick (forceTick) {
    if (forceTick || this.props.running) {
      etch.update(this)
      requestAnimationFrame(() => this.tick())
    }
  }

  render () {
    return <span>{this.formattedTime()}</span>
  }

  formattedTime () {
    const delta = Math.floor(this.state.endTime || performance.now()) - this.props.started
    const seconds = (delta / 1000).toFixed(2)
    return `${seconds}s`
  }
}
