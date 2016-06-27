'use babel'
/** @jsx etch.dom */

import etch from 'etch'

import Timer from './timer'

export default class StatusLine {
  constructor (props) {
    this.props = props
    etch.initialize(this)
  }

  update (props) {
    this.props = props
    etch.update(this)
  }

  render () {
    return (
      <div className={`test-status-container ${this.props.status}`}>
        <div className='counts'>
          {this.props.numberRan}/{this.props.totalNumber}
          {this.props.numberSkipped > 0 ? ` (${this.props.numberSkipped} skipped)` : ''}
        </div>
        <div className='test-label'>
          {this.props.label}
        </div>
        <div className='time'>
          <Timer started={this.props.startTime} ended={this.props.endTime} />
        </div>
      </div>
    )
  }
}
