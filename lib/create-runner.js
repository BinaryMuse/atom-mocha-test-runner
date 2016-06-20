'use babel'

const defaults = {
  reporter: 'dot',
  globalAtom: true,
  testSuffixes: ['test.js', 'test.coffee'],
  colors: true,
  overrideTestPaths: null
}

export default function createRunner (options = {}, callback) {
  options = Object.assign({}, defaults, options)

  return ({testPaths, buildAtomEnvironment, buildDefaultApplicationDelegate, logFile, headless}) => {
    if (options.overrideTestPaths) {
      testPaths = testPaths.map(p => {
        return p.replace(options.overrideTestPaths[0], options.overrideTestPaths[1])
      })
    }

    return new Promise(resolve => {
      try {
        // MOCHA_COLORS must be set when requiring Mocha
        if (options.colors) {
          process.env.MOCHA_COLORS = "1"
        } else {
          delete process.env.MOCHA_COLORS
        }

        const fs = require('fs')
        const path = require('path')
        const util = require('util')

        const tmp = require('tmp')
        const Mocha = require('mocha')

        const remote = require('electron').remote

        const mocha = new Mocha()

        const tmpDir = tmp.dirSync().name
        const applicationDelegate = buildDefaultApplicationDelegate()

        // TODO: Some day, we should expose this via the module system
        // so that test authors can just `require 'atom/test'`
        global.buildAtomEnvironment = function (params = {}) {
          let defaultParams = {
            applicationDelegate,
            window,
            document,
            enablePersistence: true,
            configDirPath: tmpDir
          }
          return buildAtomEnvironment(Object.assign(defaultParams, params))
        }

        if (options.globalAtom) {
          global.atom = global.buildAtomEnvironment()
        }

        const utils = Mocha.utils
        if (headless) {
          console.log = function (...args) {
            const formatted = util.format(...args)
            process.stderr.write(formatted + "\n")
          }

          Object.defineProperties(process, {
            stdout: { value: remote.process.stdout },
            stderr: { value: remote.process.stderr }
          })

          mocha.reporter(options.reporter)
        } else {
          const div = document.createElement('div')
          div.setAttribute('id', 'mocha')
          document.body.appendChild(div)
          const link = document.createElement('link')
          link.setAttribute('rel', "stylesheet")
          link.setAttribute('type', "text/css")
          link.setAttribute('href', "file://" + require.resolve('mocha/mocha.css'))
          document.head.appendChild(link)
          mocha.reporter('HTML')
        }

        for (let path of testPaths) {
          for (let resolvedFile of utils.lookupFiles(path, options.testSuffixes, true)) {
            mocha.addFile(resolvedFile)
          }
        }

        if (callback) callback(mocha)
        mocha.run(resolve)
      } catch (ex) {
        console.error(ex)
        resolve(1)
      }
    })
  }
}
