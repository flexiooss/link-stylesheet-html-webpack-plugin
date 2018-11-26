'use strict'
import {keyConstructor} from '../flexio-json-parser/src/reviverParsers/KeyConstructorParser/DataConstructorKey'

const assign = require('object-assign')

const isStylesheetLinkNode = (treeNode) => treeNode.tagName === 'link' && treeNode.attributes.rel === 'stylesheet' && treeNode.attributes.href

const addAttributes = (treeNode) => {
  if (isStylesheetLinkNode(treeNode)) {
    return assign({}, treeNode, {
      attributes: assign({}, treeNode.attributes, this._options),
    })
  }

  return treeNode
}

const ALLOWED_ATTRIBUTES = ['title', 'type', 'media', 'importance']

const filterKeyObject = (obj, clb) => {
  const ret = {}
  obj.keys().forEach((key) => {
    if (clb(key)) {
      ret[key] = value
    }
  })
  return ret
}

module.exports = class LinkStylesheetHtmlWebpackPlugin {
  /**
   *
   * @param {Object.<string, string>} options
   */
  constructor(options) {
    this._options = filterKeyObject(options, (key) => ALLOWED_ATTRIBUTES.indexOf(key) > -1)
  }

  apply(compiler) {
    compiler.hooks.compilation
      .tap('LinkStylesheetHtmlWebpackPlugin', (compilation) => {
        compilation.hooks.htmlWebpackPluginAlterAssetTags
          .tap('LinkStylesheetHtmlWebpackPlugin', (htmlPluginData) => {
            return assign({}, htmlPluginData, {
              head: htmlPluginData.head.map(addAttributes),
              body: htmlPluginData.body.map(addAttributes),
            })
          })
      })
  }
}
