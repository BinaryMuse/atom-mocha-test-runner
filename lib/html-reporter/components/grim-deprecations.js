'use babel'
/** @jsx etch.dom */

import etch from 'etch'

export default class GrimDeprecations {
  constructor (props) {
    this.props = props
    etch.initialize(this)
  }

  update (props) {
    this.props = props
    etch.update(this)
  }

  render () {
    const deprecations = this.props.deprecations || []
    if (deprecations.length === 0) {
      return <noscript />
    }

    return (
      <div className='deprecations-container'>
        <div className='deprecations-title'>Deprecations</div>
        <div>{deprecations.map(this.renderDeprecation.bind(this))}</div>
      </div>
    )
  }

  renderDeprecation (deprecation) {
    let noun = 'instances'
    if (deprecation.callCount === 1) {
      noun = 'instance'
    }
    return (
      <div className='deprecation'>
        <div className='message'>
          "{deprecation.message}" in <strong>{deprecation.originName}</strong> ({deprecation.callCount} {noun})
        </div>
        {Object.keys(deprecation.stacks).map(key => this.renderStack(deprecation.stacks[key]))}
      </div>
    )
  }

  renderStack (stack) {
    return (
      <div className='stack'>
        {stack.map(s => {
          return <div className='frame'>{s.toString()}</div>
        })}
      </div>
    )
  }
}
