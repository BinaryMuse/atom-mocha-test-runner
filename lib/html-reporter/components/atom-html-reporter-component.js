'use babel'
/** @jsx etch.dom */

import etch from 'etch'

import Dots from './dots'
import StatusLine from './status-line'
import TestFailures from './test-failures'

export default class AtomHtmlReporterComponent {
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
      <div>
        <div className='header'>
          Atom Specs
        </div>
        <Dots tests={this.props.tests} />
        <StatusLine status={this.props.status} label={this.props.label} totalNumber={this.props.testsToRun}
          numberRan={this.props.testsRan} numberSkipped={this.props.testsSkipped}
          startTime={this.props.startTime} running={this.props.running} />
        <TestFailures runner={this.props.runner} />
      </div>
    )
  }
}
