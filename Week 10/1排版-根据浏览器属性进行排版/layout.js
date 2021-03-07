/* 预处理 */

function getStyle(element) {
  if (!element.style)
    element.style = {}

  for (let prop in element.computedStyle) {
    var p = element.computedStyle.value
    element.style[prop] = element.computedStyle[prop].value

    // 干掉css的单位
    if (element.style[prop].toString().match(/px$/)) {
      element.style[prop] = parseInt(element.style[prop])
    }
// 数字转化为字符串
    if (element.style[prop].toString().match(/^[0-9\.]+$/)) {
      element.style[prop] = parseInt(element.style[prop])
    }
  }

  return element.style
}

function layout(element) {
// 如果没有computedStyle，跳过
  if (!element.computedStyle) {
    return
  }

  var elementStyle = getStyle(element)

  if (elementStyle.display !== 'flex')
    return

    // 过滤文本节点
  var items = element.children.filter(e => e.type === 'element')

  items.sort(function (a, b) {
    return (a.order || 0) - (b.order || 0)
  })

/*   处理主轴和交叉轴 */
  var style = elementStyle

  ['width', 'height'].forEach(size => {
    if (style[size] === 'auto' || style[size] === '') {
      style[size] = null
    }
  })

  // 设置默认值
  if (!style.flexDirection || style.flexDirection === 'auto')
    style.flexDirection = 'row'
  if (!style.alignItems || style.alignItems === 'auto')
    style.alignItems = 'stretch'
  if (!style.justifyContent || style.justifyContent === 'auto')
    style.justifyContent = 'row'
  if (!style.flexWrap || style.flexWrap === 'auto')
    style.flexWrap = 'nowrap'
  if (!style.alignContent || style.alignContent === 'auto')
    style.alignContent = 'stretch'

  var mainSize, mainStart, mainEnd, mainSign, mainBase,
    crossSize, crossStart, crossEnd, crossSign, crossBase

  if (style.flexDirection === 'row') {
    // 主轴尺寸
    mainSize = 'width'

    mainStart = 'left'
    mainEnd = 'right'
    // 左右排,- +
    mainSign = +1
    mainBase = 0     // c初始值

    // 交叉轴
    crossSize = 'height'
    crossStart = 'top'
    crossEnd = 'bottom'
  }
/* 和上面想对 */
  if (style.flexDirection === 'row-reverse') {
    mainSize = 'width'
    mainStart = 'right'
    mainEnd = 'left'
    mainSign = -1
    mainBase = style.width

    crossSize = 'height'
    crossStart = 'top'
    crossEnd = 'bottom'
  }

  if (style.flexDirection === 'column') {
    mainSize = 'height'
    mainStart = 'top'
    mainEnd = 'bottom'
    mainSign = +1
    mainBase = 0

    crossSize = 'width'
    crossStart = 'left'
    crossEnd = 'right'
  }

  if (style.flexDirection === 'column-reverse') {
    mainSize = 'height'
    mainStart = 'bottom'
    mainEnd = 'top'
    mainSign = -1
    mainBase = style.height

    crossSize = 'width'
    crossStart = 'left'
    crossEnd = 'right'
  }

  if (style.flexWrap === 'wrap-reverse') {
    var tmp = crossStart
    crossStart = crossEnd
    crossEnd = tmp
    crossSign = -1
  } else {
    crossBase = 0
    crossSign = 1
  }
}

module.exports = layout