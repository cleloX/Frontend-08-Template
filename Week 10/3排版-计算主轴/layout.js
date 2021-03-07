/* 预处理 */

function getStyle(element) {
  if (!element.style)
    element.style = {}

  for (let prop in element.computedStyle) {
    let p = element.computedStyle.value
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

  let elementStyle = getStyle(element)

  if (elementStyle.display !== 'flex')
    return

  // 过滤文本节点
  let items = element.children.filter(e => e.type === 'element')

  items.sort(function (a, b) {
    return (a.order || 0) - (b.order || 0)
  })

  /*   处理主轴和交叉轴 */
  let style = elementStyle

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

  let mainSize, mainStart, mainEnd, mainSign, mainBase,
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
    let tmp = crossStart
    crossStart = crossEnd
    crossEnd = tmp
    crossSign = -1
  } else {
    crossBase = 0
    crossSign = 1
  }

  // 父元素没有主轴尺寸，由子元素撑开
  let isAutoMainSize = false
  if (!style[mainSize]) {
    elementStyle[mainSize] = 0
    // 所有子元素的尺寸加起来，就是父元素的尺寸
    for (let i = 0; i < items.length; i++) {
      let item = items[i]

      if (itemStyle[mainSize] !== null || itemStyle[mainSign])
        elementStyle[mainSize] = elementStyle[mainSign]
    }
    isAutoMainSize = true
  }

  let flexLine = [] // 至少一行
  let flexLines = [flexLine]

  // 剩余空间
  let mainSpace = elementStyle[mainSize]
  let crossSpace = 0
  // 循环flex item，取出属性
  for (let i = 0; i < items.length; i++) {
    let item = items[i]
    let itemStyle = getStyle(item)

    if (itemStyle[mainSize] === null) {
      // 设置主轴尺寸为0
      itemStyle[mainSize] = 0
    }

    if (itemStyle.flex) { // flex属性，代表可伸缩
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
        flexLine = [item] // 创建新行，
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
  // 有剩余空间，加一个mainSpace属性
  flexLine.mainSpace = mainSpace
  console.log(item)

  if (style.flexWrap === 'nowrap' || isAutoMainSize) {
    // 保存crossSpace
    flexLine.crossSpace = (style[crossSize] !== undefined) ? style[crossSize] : crossSpace
  } else {
    flexLine.crossSpace = crossSpace
  }

  // 单行逻辑
  if (mainSpace < 0) {    // 进行等比压缩
    // 因为mainSpace < 0，小于1的比例
    let scale = style[mainSize] / (style[mainSize] - mainSpace)
    let currentMain = mainBase
    // 循环元素，找出属性样式
    for (let i = 0; i < items.length; i++) {
      let item = items[i]
      let itemStyle = getStyle(item)

      if (itemStyle.flex) {
        itemStyle[mainSize] = 0
      }

      itemStyle[mainSize] = itemStyle[mainSize] * scale

      // 根据元素尺寸，得到元素的位置
      itemStyle[mainStart] = currentMain  // 记录正排或者反排
      itemStyle[mainEnd] = itemStyle[mainStart] + mainSign * itemStyle[mainSize]
      currentMain = itemStyle[mainEnd]
    }
  } else {
    flexLines.forEach(function (items) {
      let mainSpace = items.mainSpace
      let flexTotal = 0
      // 循环元素,找flex元素
      for (let i = 0; i < items.length; i++) {
        let item = items[i]
        let itemStyle = getStyle(item)

        if (itemStyle.flex !== null && itemStyle.flex !== (void 0)) {
          flexTotal += itemStyle.flex
          continue
        }
      }


      if (flexTotal > 0) {    // 有flex元素
        let currentMain = mainBase
        for (let i = 0; i < items.length; i++) {
          let item = items[i];
          let itemStyle = getStyle(item)

          if (itemStyle.flex) {
            // 进行等比划分，
            itemStyle[mainSize] = (mainSpace / flexTotal) * itemStyle.flex
          }

          itemStyle[mainStart] = currentMain 
          itemStyle[mainEnd] = itemStyle[mainStart] + mainSign * itemStyle[mainSize]
          currentMain = itemStyle[mainEnd]
        }
        /* 如果没有flex-item，则根据justified规则进行分配，
        以下justified的几种属性值 */
      } else {
        if (style.justifyContent === 'flex-start') {
          let currentMain = mainBase
          let step = 0  // 元素之间没有间隔
        }
        if (style.justifyContent === 'flex-end') {
          let currentMain = mainBase * mainSign + mainBase
          let step = 0
        }
        if (style.justifyContent === 'center') {
          let currentMain = mainBase / 2 * mainSign + mainBase
          let step = 0
        }
        if (style.justifyContent === 'space-between') {  // 元素有间隔items.length - 1
          let currentMain = mainBase
          let step = mainSpace / (items.length - 1) * mainSign
        }

        if (style.justifyContent === 'space-around') {
          let step = mainSpace / item.length * mainSpace
          let currentMain = step / 2 + mainBase
        }

        for (let i = 0; i < items.length; i++) {
          let item = items[i];
          itemStyle[mainStart, currentMain]
          itemStyle[mainEnd] = itemStyle[mainStart] + mainSign * itemStyle[mainSize]
          currentMain = itemStyle[mainEnd] + step
        }
      }
    })
  }
}

module.exports = layout