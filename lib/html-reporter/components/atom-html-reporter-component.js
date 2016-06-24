'use babel'
/** @jsx etch.dom */

import etch from 'etch'

import Dots from './dots'
import GrimDeprecations from './grim-deprecations'
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
        <div className='header'>{this.props.title}</div>
        <Dots tests={this.props.tests} />
        <StatusLine status={this.props.status} label={this.props.label} totalNumber={this.props.testsToRun}
          numberRan={this.props.testsRan} numberSkipped={this.props.testsSkipped}
          startTime={this.props.startTime} running={this.props.running} />
        {this.props.testTitle ? <div className='current-test'>Running test: {this.props.testTitle}</div> : <noscript />}
        <TestFailures runner={this.props.runner} />
        <GrimDeprecations deprecations={this.props.deprecations} />
      </div>
    )
  }
}
