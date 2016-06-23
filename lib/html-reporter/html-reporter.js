'use babel'

const defaultOptions = {}

import AtomHtmlReporterComponent from './components/atom-html-reporter-component'

function calculateLabel (test) {
  if (test.parent && test.parent.title) {
    return calculateLabel(test.parent)
  } else {
    return test.title
  }
}

module.exports = class AtomHtmlReporter {
  constructor (runner, {reporterOptions}) {
    this.options = Object.assign({}, defaultOptions, reporterOptions)

    this.runner = runner
    this.label = ''
    this.status = 'waiting'
    this.running = false
    this.startTime = null
    this.tests = []
    this.stats = {
      testsToRun: 0,
      testsSkipped: 0,
      testsRan: 0
    }

    runner.on('start', this.onStart.bind(this))
    runner.on('test', this.onTest.bind(this))
    runner.on('test end', this.onTestEnd.bind(this))
    runner.on('fail', this.onTestFail.bind(this))
    runner.on('end', this.onEnd.bind(this))

    this.render()
  }

  onStart () {
    this.startTime = performance.now()
    this.running = true
    this.runner.suite.eachTest(test => {
      console.log(test, test.pending)
      this.tests.push(test)
      if (test.pending) this.stats.testsSkipped++
    })
    this.render()
  }

  onTest (test) {
    this.label = calculateLabel(test)
    this.render()
  }

  onTestEnd (test) {
    if (!test.pending) this.stats.testsRan++
    this.render()
  }

  onTestFail (test, err) {
    test.err = err
    this.status = 'failed'
    this.render()
  }

  onEnd () {
    this.running = false
    switch (this.status) {
      case 'waiting':
        this.status = 'passed'
        this.label = `${this.stats.testsRan} passed`
        break;
      case 'failed':
        const testsFailed = this.tests.filter(t => t.state === 'failed').length
        const noun = testsFailed === 1 ? 'failure' : 'failures'
        this.label = `${testsFailed} ${noun}`
        break;
    }
    this.render()
  }

  render () {
    const props = {
      runner: this.runner,
      tests: this.tests,
      label: this.label,
      status: this.status,
      running: this.running,
      startTime: this.startTime,
      testsToRun: this.stats.testsToRun,
      testsSkipped: this.stats.testsSkipped,
      testsRan: this.stats.testsRan
    };

    if (!this.component) {
      this.component = this.buildComponent(props)
    } else {
      this.component.update(props)
    }
  }

  buildComponent (props) {
    this.prepareDocument()

    const container = document.createElement('div')
    document.body.appendChild(container)
    const component = new AtomHtmlReporterComponent(props)
    container.appendChild(component.element)
    return component
  }

  prepareDocument () {
    const link = document.createElement('link')
    link.setAttribute('rel', "stylesheet/less")
    link.setAttribute('type', "text/css")
    link.setAttribute('href', "file://" + require.resolve('./style.less'))
    document.head.appendChild(link)
    const script = document.createElement('script')
    script.setAttribute('type', "text/javascript")
    script.setAttribute('src', "file://" + require.resolve('less/dist/less.min.js'))
    document.head.appendChild(script)
  }
}
