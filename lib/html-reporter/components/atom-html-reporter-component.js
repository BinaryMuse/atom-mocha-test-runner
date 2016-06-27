'use babel'
/** @jsx etch.dom */

import etch from 'etch'

import Dots from './dots'
import GrimDeprecations from './grim-deprecations'
import Octicon from './octicon'
import StatusLine from './status-line'
import TestFailures from './test-failures'

export default class AtomHtmlReporterComponent {
  constructor (props) {
    this.props = props
    this.handleRefreshClick = this.handleRefreshClick.bind(this)
    etch.initialize(this)
  }

  update (props) {
    this.props = props
    etch.update(this)
  }

  handleRefreshClick (e) {
    e.preventDefault()
    this.props.restart()
  }

  render () {
    return (
      <div>
        <div className='header'>
          <span>{this.props.title}</span>
          <Octicon icon='sync' style='float: right; cursor: pointer;' onclick={this.handleRefreshClick} />
        </div>
        <Dots tests={this.props.tests} />
        <StatusLine status={this.props.status} label={this.props.label} totalNumber={this.props.testsToRun}
          numberRan={this.props.testsRan} numberSkipped={this.props.testsSkipped}
          startTime={this.props.startTime} endTime={this.props.endTime} />
        {this.props.testTitle ? <div className='current-test'>Running test: {this.props.testTitle}</div> : <noscript />}
        <TestFailures runner={this.props.runner} rootSuite={this.props.rootSuite} />
        <GrimDeprecations deprecations={this.props.deprecations} />
      </div>
    )
  }

  destroy () {
    return etch.destroy(this)
  }
}
