'use babel'

const defaultOptions = {}

import Grim from 'grim'

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
    this.restart = this.restart.bind(this)
    this.rerunTests = reporterOptions.rerun

    this.runner = runner
    this.label = ''
    this.status = 'waiting'
    this.startTime = null
    this.endTime = null
    this.tests = []
    this.rootSuite = runner.suite
    this.currentTestTitle = ""
    deprecations: [],
    this.stats = {
      testsToRun: 0,
      testsSkipped: 0,
      testsRan: 0,
      testsFailed: 0
    }

    runner.on('start', this.onStart.bind(this))
    runner.on('test', this.onTest.bind(this))
    runner.on('test end', this.onTestEnd.bind(this))
    runner.on('fail', this.onTestFail.bind(this))
    runner.on('end', this.onEnd.bind(this))

    this.render()
  }

  restart () {
    this.runner.abort()
    this.component.destroy()
    this.rerunTests()
  }

  onStart () {
    this.startTime = performance.now()
    this.runner.suite.eachTest(test => {
      this.tests.push(test)
      if (test.pending) this.stats.testsSkipped++
      else this.stats.testsToRun++
    })
    this.render()
  }

  onTest (test) {
    this.label = calculateLabel(test)
    this.currentTestTitle = test.fullTitle()
    this.render()
  }

  onTestEnd (test) {
    this.deprecations = Grim.getDeprecations()
    if (!test.pending) this.stats.testsRan++
    this.render()
  }

  onTestFail (test, err) {
    test.err = err
    this.stats.testsFailed++
    this.render()
  }

  onEnd () {
    this.endTime = performance.now()
    this.currentTestTitle = ""
    this.deprecations = Grim.getDeprecations()
    const passed = this.stats.testsFailed === 0
    if (passed) {
      this.status = 'passed'
      this.label = `${this.stats.testsRan} passed`
    } else {
      this.status = 'failed'
      const noun = this.stats.testsFailed === 1 ? 'failure' : 'failures'
      this.label = `${this.stats.testsFailed} ${noun}`
    }
    this.render()
  }

  render () {
    const props = {
      title: this.options.title || "Atom Test Runner",
      testTitle: this.currentTestTitle,
      runner: this.runner,
      rootSuite: this.rootSuite,
      tests: this.tests,
      label: this.label,
      status: this.status,
      startTime: this.startTime,
      endTime: this.endTime,
      testsToRun: this.stats.testsToRun,
      testsSkipped: this.stats.testsSkipped,
      testsRan: this.stats.testsRan,
      deprecations: this.deprecations,

      restart: this.restart
    };

    if (!this.component) {
      this.component = this.buildComponent(props)
    } else {
      this.component.update(props)
    }
  }

  buildComponent (props) {
    this.prepareDocument(props)

    const container = document.createElement('div')
    container.setAttribute('id', 'atom-mocha-test-runner')
    const shadow = container.createShadowRoot()
    document.body.appendChild(container)
    const component = new AtomHtmlReporterComponent(props)
    shadow.appendChild(component.element)
    return component
  }

  prepareDocument (props) {
    document.title = props.title

    // Allow document.title to be assigned in specs without screwing up spec window title
    let documentTitle = null
    Object.defineProperty(document, 'title', {
      get () { return documentTitle },
      set (title) { documentTitle = title },
      configurable: true
    })

    const atomStylesTag = document.querySelector('atom-styles')
    if (atomStylesTag) atomStylesTag.remove()

    this.addElement(document.head, 'link', {
      'rel': 'stylesheet/less',
      'type': 'text/css',
      'href': "file://" + require.resolve('./style.less')
    })

    this.addElement(document.head, 'script', {
      'type': 'text/javascript',
      'src': "file://" + require.resolve('less/dist/less.min.js')
    })
  }

  addElement (parent, type, props) {
    const el = document.createElement(type)
    for (let propName of Object.keys(props)) {
      el.setAttribute(propName, props[propName])
    }
    parent.appendChild(el)
  }
}
