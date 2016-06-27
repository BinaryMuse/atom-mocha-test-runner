'use babel'
/** @jsx etch.dom */

import etch from 'etch'

export default class Octicon {
  constructor (props) {
    this.props = props
    etch.initialize(this)
  }

  update (props) {
    this.props = props
    etch.initialize(this)
  }

  render () {
    const {icon, ...others} = this.props
    const file = require.resolve(`../octicons/svg/${icon}.svg`)
    return <img {...others} src={`file://${file}`} />
  }
}
