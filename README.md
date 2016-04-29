# Atom Mocha Test Runner

🚧 Work in Progress 🚧

By default, Atom runs your tests with Jasmine. Atom allows you to specify a custom test runner using the `atomTestRunner` field in your `package.json`, but implementing a custom test runner is not straightforward. This module allows you to run your specs using Mocha with minimal fuss.

## Installation

```
$ apm install [--save-dev] atom-mocha-test-runner
```

## Usage

### Default Test Runner

If you want to use all the default options, simply pass the module name as the `atomTestRunner` value in your `package.json`:

```javascript
{
  "name": "my-package",
  // ...
  "atomTestRunner": "atom-mocha-test-runner"
}
```

Note that your `package.json` may be cached by Atom's compile cache, so if adding or changing that field doesn't seem to work, try quitting and restarting Atom.

### Programmatic Usage

If you'd like to perform more customization of your testing environment, you can create a custom runner while still utilizing atom-mocha-test-runner for most of the heavy lifting. First, set `atomTestRunner` to a *relative* path to a file:

```javascript
{
  "name": "my-package",
  // ...
  "atomTestRunner": "./spec/custom-runner"
}
```

Then export a test runner created from atom-mocha-test-runner from `spec/custom-runner.js`:

```javascript
var createRunner = require('atom-mocha-test-runner').createRunner

var extraOptions = {
  testSuffixes: ['-spec.js', '-spec.coffee']
}

var optionalConfigurationFunction = function (mocha) {
  // If provided, atom-mocha-test-runner will pass the mocha instance
  // to this function, so you can do whatever you'd like to it.
}

module.exports = createRunner(extraOptions, optionalConfigurationFunction)
```

#### API

**`createRunner([options,] [callback])`**

Returns a test runner with the given `options` and `callback`. Both parameters are optional. The returned value can be exported from your `atomTestRunner` script.

* `options` - An object specifying customized options:

  * `options.reporter [default: 'bdd']` - Which reporter to use on the terminal
  * `options.globalAssert [default: true]` - Whether or not to assign `chai.assert` to `global.assert`
  * `options.globalExpect [default: true]` - Whether or not to assign `chai.expect` to `global.expect`
  * `options.chaiShould [default: false]` - Whether or not to call `chai.should()` to install Chai's `should`-style assertions
  * `globalAtom [default: true]` - Whether or not to assign the created Atom environment to `global.atom`
  * `testSuffixes [default: ['test.js', 'test.coffee']]` - File extensions that indicate that the file contains tests (TODO: fix me)
  * `colors [default: true]` - Whether or not to colorize output on the terminal
