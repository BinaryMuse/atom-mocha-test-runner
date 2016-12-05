'use babel'
/** @jsx etch.dom */

import etch from 'etch'

export default class Collapser {
  constructor (props, children) {
    this.props = props
    this.children = children

    this.collapsed = false
    this.toggleCollapsed = this.toggleCollapsed.bind(this)

    etch.initialize(this)
    Collapser.instances.add(this)
  }

  update (props, children) {
    this.props = props
    this.children = children
    etch.update(this)
  }

  render () {
    const {header, ...others} = this.props
    const fullHeader = (
      <div style={{cursor: 'pointer', display: 'flex'}} onclick={this.toggleCollapsed}>
        {this.renderTriangle()}
        {header}
      </div>
    )
    const contents = (
      <div style={{display: this.collapsed ? 'none' : 'block'}}>
        {this.children}
      </div>
    )

    return (
      <div {...others}>{fullHeader}{contents}</div>
    )
  }

  renderTriangle () {
    return (
      <div style={{flexBasis: '20px', marginRight: '5px'}}>
        {this.collapsed ? '\u25B6\uFE0E' : '\u25BC'}
      </div>
    )
  }

  toggleCollapsed (e) {
    e.stopPropagation()
    this.collapsed = !this.collapsed
    etch.update(this)
  }

  collapse () {
    this.collapsed = true
    etch.update(this)
  }

  uncollapse () {
    this.collapsed = false
    etch.update(this)
  }

  destroy () {
    Collapser.instances.delete(this)
    etch.destroy(this)
  }
}

Collapser.instances = new Set()

Collapser.collapseAll = () => {
  Collapser.instances.forEach(c => c.collapse())
}

Collapser.uncollapseAll = () => {
  Collapser.instances.forEach(c => c.uncollapse())
}
