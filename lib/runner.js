'use babel'

const defaults = {
  reporter: 'dot',
  globalAssert: true,
  globalExpect: true,
  chaiShould: false,
  globalAtom: true,
  testSuffixes: ['test.js', 'test.coffee'],
  colors: true,
}

const createRunner = (options, callback) => {
  if (typeof options === 'function') {
    callback = options
    options = {}
  }

  options = Object.assign({}, defaults, options)

  return ({testPaths, buildAtomEnvironment, buildDefaultApplicationDelegate, logFile, headless}) => {
    return new Promise((res, rej) => {
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
        const chai = require('chai')

        const remote = require('electron').remote

        if (options.globalAssert) {
          global.assert = chai.assert
        }

        if (options.globalExpect) {
          global.expect = chai.expect
        }

        if (options.chaiShould) {
          global.should = chai.should()
        }

        const mocha = new Mocha()

        const tmpDir = tmp.dirSync().name
        const applicationDelegate = buildDefaultApplicationDelegate()
        const env = buildAtomEnvironment({
          applicationDelegate,
          window,
          document,
          enablePersistence: true,
          configDirPath: tmpDir,
        })

        if (options.globalAtom) {
          global.atom = env
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
        mocha.run(res)
      } catch (ex) {
        console.error(ex)
        res(1)
      }
    })
  }
}

module.exports = createRunner()
module.exports.createRunner = createRunner
