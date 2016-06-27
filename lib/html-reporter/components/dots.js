'use babel'
/** @jsx etch.dom */

import etch from 'etch'

import Dot from './dot'

export default class Dots {
  constructor (props) {
    this.props = props
    etch.initialize(this)
  }

  update (props) {
    this.props = props
    etch.update(this)
  }

  render () {
    return (
      <ul className='dots-container'>
        {this.props.tests.map(this.renderDot)}
      </ul>
    )
  }

  renderDot (test, index) {
    return <Dot key={index} test={test} />
  }
}
