'use babel'

import Grim from 'grim'

const defaults = {
  htmlTitle: '',
  reporter: 'dot',
  globalAtom: true,
  testSuffixes: ['test.js', 'test.coffee'],
  colors: process.platform !== 'win32'
}

export default function createRunner (options = {}, callback) {
  options = Object.assign({}, defaults, options)

  return ({testPaths, buildAtomEnvironment, buildDefaultApplicationDelegate, logFile, headless}) => {
    function runTests (testPaths, resolve) {
      const fs = require('fs')
      const path = require('path')
      const util = require('util')

      const tmp = require('tmp')

      const remote = require('electron').remote

      const Mocha = require('mocha')
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
          process.stdout.write(formatted + "\n")
        }

        Object.defineProperties(process, {
          stdout: { value: remote.process.stdout },
          stderr: { value: remote.process.stderr }
        })

        mocha.reporter(options.reporter)
      } else {
        process.on('uncaughtException', console.error.bind(console))
        mocha.reporter(require('./html-reporter/html-reporter'), {
          title: options.htmlTitle,
          rerun: function () {
            runTests(testPaths, resolve)
          }
        })
      }

      for (let path of testPaths) {
        let resolvedFiles = utils.lookupFiles(path, options.testSuffixes, true);
        if (typeof resolvedFiles === "string") {
          resolvedFiles = [resolvedFiles];
        }
        for (let resolvedFile of resolvedFiles) {
          delete require.cache[resolvedFile]
          mocha.addFile(resolvedFile)
        }
      }

      if (callback) callback(mocha)
      Grim.clearDeprecations()
      const runner = mocha.run(resolve)
      window.runner = runner
    }

    return new Promise(resolve => {
      try {
        // MOCHA_COLORS must be set when requiring Mocha
        if (options.colors) {
          process.env.MOCHA_COLORS = "1"
        } else {
          delete process.env.MOCHA_COLORS
        }

        runTests(testPaths, resolve)
      } catch (ex) {
        console.error(ex.stack)
        resolve(1)
      }
    })
  }
}
