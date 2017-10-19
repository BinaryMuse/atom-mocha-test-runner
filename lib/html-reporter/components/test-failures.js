'use babel'
/** @jsx etch.dom */

import etch from 'etch'
import url from 'url'
import path from 'path'

import Collapser from './collapser'

export default class TestFailures {
  constructor (props) {
    this.props = props

    this.itemsToRender = new Set()
    this.props.runner.on('fail', this.onTestFail.bind(this))

    etch.initialize(this)
  }

  update (props) {
    this.props = props
    etch.update(this)
  }

  onTestFail (test) {
    this.itemsToRender.add(test)
    while (test.parent) {
      this.itemsToRender.add(test.parent)
      test = test.parent
    }
    etch.update(this)
  }

  render () {
    return (
      <div className='failures-container'>
        {this.props.rootSuite.suites.map(this.renderTopLevelSuite.bind(this))}
      </div>
    )
  }

  renderTopLevelSuite (suite) {
    if (this.itemsToRender.has(suite)) {
      return (
        <Collapser className='root' header={<span className='header'>{suite.title}</span>}>
          <div className='tests-container'>
            {this.renderSuiteFailures(suite)}
          </div>
        </Collapser>
      )
    }
  }

  renderSuiteFailures (suite) {
    return (
      <div>
        {this.renderTestFailures(suite._beforeAll)}
        {this.renderTestFailures(suite._beforeEach)}
        {this.renderTestFailures(suite._afterEach)}
        {this.renderTestFailures(suite._afterAll)}
        {this.renderTestFailures(suite.tests)}
        {suite.suites.map(this.renderSubSuite.bind(this))}
      </div>
    )
  }

  renderTestFailures (tests) {
    return tests.map(test => {
      if (this.itemsToRender.has(test)) {
        return this.renderFailedTest(test)
      }
    })
  }

  renderFailedTest (test) {
    const stack = (test.err && test.err.stack) || '(no stack trace)'
    return (
      <Collapser className='test' header={<div className='title'>{test.title}</div>}>
        <div className='assertion-failure'>{test.err.message}</div>
        <div className='stack'>{stack.split('\n').map(this.renderStackFrame.bind(this))}</div>
      </Collapser>
    )
  }

  renderStackFrame (frame) {
    const match = frame.trimRight().match(/^(.*)\(([^\)]+)\)$/)
    const defaultElem = <div>{frame}</div>

    if (!match) {
      return defaultElem
    }

    const [filename, line, column] = match[2].split(':')
    if (!path.isAbsolute(filename)) {
      return defaultElem
    }

    const uri = url.format({
      protocol: 'atom:',
      slashes: true,
      host: 'core',
      pathname: '/open/file',
      query: {
        filename, line, column
      }
    })
    return (
      <div>
        {match[1]}(<a href={uri} onclick={this.handleFileLinkClick}>{match[2]}</a>)
      </div>
    )
  }

  renderSubSuite (suite) {
    if (this.itemsToRender.has(suite)) {
      return (
        <Collapser className='tests-container' header={<span>{suite.title}</span>}>
          <div className='tests-container'>
            {this.renderSuiteFailures(suite)}
          </div>
        </Collapser>
      )
    }
  }

  handleFileLinkClick (e) {
    e.preventDefault()
    const href = e.target.getAttribute('href')
    require('electron').shell.openExternal(href)
  }
}
