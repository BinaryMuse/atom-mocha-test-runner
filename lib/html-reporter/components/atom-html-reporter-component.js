'use babel'
/** @jsx etch.dom */

import etch from 'etch'

import Collapser from './collapser'
import Dots from './dots'
import GrimDeprecations from './grim-deprecations'
import Octicon from './octicon'
import StatusLine from './status-line'
import TestFailures from './test-failures'

export default class AtomHtmlReporterComponent {
  constructor (props) {
    this.props = props
    this.handleRefreshClick = this.handleRefreshClick.bind(this)
    this.collapseAll = this.collapseAll.bind(this)
    this.uncollapseAll = this.uncollapseAll.bind(this)
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

  collapseAll (e) {
    e.preventDefault()
    Collapser.collapseAll()
  }

  uncollapseAll (e) {
    e.preventDefault()
    Collapser.uncollapseAll()
  }

  render () {
    return (
      <div>
        <div className='top-header'>
          <span>{this.props.title}</span>
          <span style='float: right'>
            <span className='collapser-links'>
              [ <a href='#' onclick={this.collapseAll}>
                Collapse All
              </a> | <a href='#' onclick={this.uncollapseAll}>Uncollapse All</a> ]
            </span>
            <Octicon icon='sync' style='cursor: pointer; display: none;' onclick={this.handleRefreshClick} />{/* todo: fix this */}
          </span>
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
