'use babel'
/** @jsx etch.dom */

import etch from 'etch'

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
        <div className='root'>
          <span className='header'>{suite.title}</span>
          <div className='tests-container'>
            {this.renderSuiteFailures(suite)}
          </div>
        </div>
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
    return (
      <div className='test'>
        <div className='title'>{test.title}</div>
        <div className='assertion-failure'>{test.err.message}</div>
        <div className='stack'>{test.err.stack.split('\n').map(cs => <div>{cs}</div>)}</div>
      </div>
    )
  }

  renderSubSuite (suite) {
    if (this.itemsToRender.has(suite)) {
      return (
        <div className='tests-container'>
          <span>{suite.title}</span>
          <div className='tests-container'>
            {this.renderSuiteFailures(suite)}
          </div>
        </div>
      )
    }
  }
}
