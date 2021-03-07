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
    mainBase = 0 // c初始值

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

  // 父元素没有主轴尺寸，由子元素撑开
  var isAutoMainSize = false
  if (!style[mainSize]) {
    elementStyle[mainSize] = 0
    // 所有子元素的尺寸加起来，就是父元素的尺寸
    for (var i = 0; i < items.length; i++) {
      var item = items[i]

      if (itemStyle[mainSize] !== null || itemStyle[mainSign])
        elementStyle[mainSize] = elementStyle[mainSign]
    }
    isAutoMainSize = true
  }

  var flexLine = []   // 至少一行
  var flexLines = [flexLine]

  // 剩余空间
  var mainSpace = elementStyle[mainSize]
  var crossSpace = 0
// 循环flex item，取出属性
  for (var i = 0; i < items.length; i++) {
    var item = items[i]
    var itemStyle = getStyle(item)

    if (itemStyle[mainSize] === null) {
      // 设置主轴尺寸为0
      itemStyle[mainSize] = 0
    }

    if (itemStyle.flex) {   // flex属性，代表可伸缩
      flexLine.push(item)
    } else if (style.flexWrap === 'nowrap' && isAutoMainSize) {
      mainSpace -= itemStyle[mainSize]
      if (itemStyle[crossSize] !== null && itemStyle[crossSize] !== (void 0))
        crossSpace = Math.max(crossSpace, itemStyle[crossSize])
      flexLine.push(item)
    } else {
      if (itemStyle[mainSize] > style[mainSize]) {
        itemStyle[mainSize] = style[mainSize]
      }

      // 主轴剩余空间不足以容纳元素，启用换行
      if (mainSpace < itemStyle[mainSize]) {
        flexLine.mainSpace = mainSpace
        flexLine.crossSpace = crossSpace
        flexLine = [item]  // 创建新行，
        flexLines.push(flexLine)
        // 重置两个属性
        mainSpace = style[mainSize]
        crossSpace = 0
      } else {
        flexLine.push(item)
      }

      // 计算主轴和交叉轴的属性
      if (itemStyle[crossSize] !== null && itemStyle[crossSize] !== (void 0))
        crossSpace = Math.max(crossSpace, itemStyle[crossSize])
      mainSpace -= itemStyle[mainSize]
    }
  }
  flexLine.mainSpace = mainSpace
  console.log(item)
}

module.exports = layout