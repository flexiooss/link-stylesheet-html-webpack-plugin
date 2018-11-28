'use strict'
const assign = require('object-assign')
// const HtmlWebpackPlugin = require('html-webpack-plugin')
const {getOptions} = require('loader-utils')
const stringifyCss = require('css-stringify')
const parseCss = require('css-parse')

module.exports = function (content, map, meta) {
  // this.callback(null, (content)=>{
  // const options = getOptions(this)
  console.log('#############################################"')
  console.log(this.resourcePath)
  console.log(content)
  console.log(this.value)
  console.log('#############################################"')
  // content = content.replace(/_{3}mobile_{3}/g, options.mobile);
  // }, map, meta);
  // const r =group(content)
  // console.log(r)
  process.exit(1)
  return content
}

const indexOf = [].indexOf || function (item) {
  for (var i = 0, l = this.length; i < l; i++) {
    if (i in this && this[i] === item) return i
  }
  return -1
}

const isStyleNode = (treeNode) => (treeNode.tagName === 'link' && treeNode.attributes.rel === 'stylesheet' && treeNode.attributes.href != '') || treeNode.tagName === 'style'

const addAttributes = function (treeNode) {
  if (isStyleNode(treeNode)) {
    console.log('-------addAttributes-------')
    console.log(treeNode)
    console.log(this._options)
    treeNode = assign({}, treeNode, {
      attributes: assign({}, treeNode.attributes, this._options),
    })
    console.log(treeNode)
  }

  return treeNode
}

const ALLOWED_ATTRIBUTES = ['title', 'type', 'media', 'importance']

const filterKeyObject = (obj, clb) => {
  console.log('################################################"')
  console.log(obj)
  const ret = {}
  Object.keys(obj).forEach((key) => {
    if (clb(key)) {
      ret[key] = obj[key]
    }
  })
  return ret
}
const group = function (css) {
  var emToPxRatio, i, intervalRules, len, m, media, mediaRules, medias, onlyMaxRules, onlyMinRules, otherRules, parsed,
    ref, rootRules, rule, rules
  parsed = parseCss(css)
  medias = {}
  rootRules = []
  ref = parsed.stylesheet.rules
  for (i = 0, len = ref.length; i < len; i++) {
    rule = ref[i]
    if (rule.type === 'media') {
      if (!medias[rule.media]) {
        medias[rule.media] = []
      }
      medias[rule.media] = medias[rule.media].concat(rule.rules)
    } else {
      rootRules.push(rule)
    }
  }
  mediaRules = []
  for (media in medias) {
    rules = medias[media]
    rule = {
      type: 'media',
      media: media,
      rules: rules
    }
    if (media.indexOf('min-width') !== -1) {
      m = media.match(/min-width:\s*(\d+)(px|em)?/)
      if (m && m[1]) {
        rule.minWidth = parseInt(m[1])
      }
      if (m[2]) {
        rule.unit = m[2]
      }
    }
    if (media.indexOf('max-width') !== -1) {
      m = media.match(/max-width:\s*(\d+)(px|em)?/)
      if (m && m[1]) {
        rule.maxWidth = parseInt(m[1])
      }
      if (m[2]) {
        rule.unit = m[2]
      }
    }
    if (media.indexOf('print') !== -1) {
      m = media.match(/max-width:\s*(\d+)(px|em)?/)
      if (m && m[1]) {
        rule.maxWidth = parseInt(m[1])
      }
      if (m[2]) {
        rule.unit = m[2]
      }
    }
    mediaRules.push(rule)
  }
  onlyMinRules = mediaRules.filter(function (rule) {
    return (rule.minWidth != null) && (rule.maxWidth == null)
  })
  onlyMaxRules = mediaRules.filter(function (rule) {
    return (rule.maxWidth != null) && (rule.minWidth == null)
  })
  intervalRules = mediaRules.filter(function (rule) {
    return (rule.minWidth != null) && (rule.maxWidth != null)
  })
  otherRules = mediaRules.filter(function (rule) {
    return indexOf.call(onlyMinRules.concat(onlyMaxRules).concat(intervalRules), rule) < 0
  })
  emToPxRatio = 16
  onlyMinRules.sort(function (a, b) {
    var aPxValue, bPxValue
    aPxValue = a.minWidth
    bPxValue = b.minWidth
    if (a.unit === 'em') {
      aPxValue *= emToPxRatio
    }
    if (b.unit === 'em') {
      bPxValue *= emToPxRatio
    }
    return aPxValue - bPxValue
  })
  onlyMaxRules.sort(function (a, b) {
    var aPxValue, bPxValue
    aPxValue = a.maxWidth
    bPxValue = b.maxWidth
    if (a.unit === 'em') {
      aPxValue *= emToPxRatio
    }
    if (b.unit === 'em') {
      bPxValue *= emToPxRatio
    }
    return bPxValue - aPxValue
  })
  parsed.stylesheet.rules = rootRules.concat(onlyMinRules).concat(onlyMaxRules).concat(intervalRules).concat(otherRules).concat(printRules)
  return stringifyCss(parsed)
}


// module.exports = class LinkStylesheetHtmlWebpackPlugin {
//   /**
//    *
//    * @param {Object.<string, string>} options
//    */
//   constructor(options) {
//     this._options = filterKeyObject(options, (key) => ALLOWED_ATTRIBUTES.indexOf(key) > -1)
//   }
//
//
//   apply(compiler) {
//     console.log('1---------ici')
//
//     if (compiler.hooks) {
//       compiler.hooks.compilation
//         .tap('LinkStylesheetHtmlWebpackPlugin', function (cmpp) {
// console.log(cmpp.hooks)
//           // cmpp.hooks.beforeAssetTagGeneration.tapAsync('LinkStylesheetHtmlWebpackPlugin', (data, cb) => {
//           //   // const ret = assign({}, data, {
//           //   //   head: data.head.map(addAttributes, this),
//           //   //   body: data.body.map(addAttributes, this),
//           //   // })
//           //   console.log(data)
//           //   return cb(null, data)
//           // })
//           // cmpp.hooks.htmlWebpackPluginAlterAssetTags.tapAsync('link-stylesheet-html-webpack-plugin', (data, cb) => {
//           //   const ret = assign({}, data, {
//           //     head: data.head.map(addAttributes, this),
//           //     body: data.body.map(addAttributes, this),
//           //   })
//           //   return cb(null, ret)
//           // })
//
//         })
//
//
//       // if (compiler.hooks) {
//       //   compiler.hooks.compilation.tap('LinkStylesheetHtmlWebpackPlugin', (compilation) => {
//       //       const hooks = HtmlWebpackPlugin.getHooks(compilation)
//       //       hooks.alterAssetTags.tapAsync(
//       //         'LinkStylesheetHtmlWebpackPlugin',
//       //         (data, cb) => {
//       //           const ret = assign({}, data, {
//       //             head: data.head.map(addAttributes, this),
//       //             body: data.body.map(addAttributes, this),
//       //           })
//       //           return cb(null, ret)
//       //         })
//       //
//       // }
//       //   )
//       //
//       // }
//     }
//   }


// }
