# Atom Mocha Test Runner

By default, Atom runs your tests with Jasmine (for more information on testing packages in Atom, please [see the Atom Flight Manual](http://flight-manual.atom.io/hacking-atom/sections/writing-specs/#running-specs)). Atom allows you to specify a custom test runner using the `atomTestRunner` field in your `package.json`, but implementing a custom test runner is not straightforward. This module allows you to run your specs using Mocha with minimal fuss.

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

Note that your `package.json` may be cached by Atom's compile cache when running tests with Atom's GUI test runner, so if adding or changing that field doesn't seem to work, try quitting and restarting Atom. Also note that by default, the runner looks for tests with a `.test.js` or `.test.coffee` file extension, e.g. `my-component.test.js`.

### Programmatic Usage

If you'd like to perform more customization of your testing environment, you can create a custom runner while still utilizing atom-mocha-test-runner for most of the heavy lifting. First, set `atomTestRunner` to a *relative* path to a file:

```javascript
{
  "name": "my-package",
  // ...
  "atomTestRunner": "./test/custom-runner"
}
```

Then export a test runner created via the atom-mocha-test-runner from `test/custom-runner.js`:

```javascript
var createRunner = require('atom-mocha-test-runner').createRunner

// optional options to customize the runner
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

Returns a test runner created with the given `options` and `callback`. Both parameters are optional. The returned value can be exported from your `atomTestRunner` script for Atom to consume.

* `options` - An object specifying customized options:

  * `options.reporter [default: 'dot']` - Which reporter to use on the terminal
  * `globalAtom [default: true]` - Whether or not to assign the created Atom environment to `global.atom`
  * `testSuffixes [default: ['test.js', 'test.coffee']]` - File extensions that indicate that the file contains tests
  * `colors [default: true (false on Windows)]` - Whether or not to colorize output on the terminal
  * `htmlTitle [default: '']` - The string to use for the window title in the HTML reporter

### Making Assertions

atom-mocha-test-runner does not include any assertion libraries; it only includes the Mocha test runner. You can pull in any assertion library you want, but [Chai](http://chaijs.com/) is a great choice.

```javascript
const assert = require('chai').assert

describe('Testing', function () {
  it('works', function () {
    assert.equal(answerToLifeUniverseAndEverything, 42)
  })
})
````
