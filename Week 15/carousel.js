/* 
// element函数的作用：
// 根据type（标签或者组件名）、attributes属性（属性对象，包括属性名和属性值）、children来创建一个真实的element 
利用现有的标签写的一个简易的createElement
function creatElement(type, attributes, ...children) {
  let element;
  if(typeof type === 'string')
    element = document.createElement(type);  // 普通的标签
  else{
    element = new type;  // 创建自己的组件对象
  }

  // 为组件（标签添加属性）
  for(let name in attributes){
    element.setAttribute(name, attributes[name]);
  }

  // 为组件添加children
  for(let child of children){
    // 判断是否为文本节点
    if(typeof child === 'string'){
      child = document.createTextNode(child);
    }
    element.appendChild(child);
  }

  return element
}

*/

import { creatElement, ComponentFunc } from "./frameworkname"





class Carousel extends ComponentFunc {
  constructor() {
    super()
    this.attributes = Object.create(null)
  }
  setAttribute(name, value) {
    this.attributes[name] = value
  }
  render() {
    this.root = document.createElement("div")
    this.root.classList.add("carousel")
    for (let record of this.attributes.src) {
      // let child = document.createElement('img')
      // child.src = img
      // 用div的背景图代替img
      let child = document.createElement("div")
      child.style.backgroundImage = `url('${record}')`
      this.root.appendChild(child)
    }

    let position = 0
    this.root.addEventListener("mousedown", event => {
      let children = this.root.children
      let startX = event.clientX

      let move = event => {
        let x = event.clientX - startX
        //当前在屏幕上元素的位置
        let current = position - ((x - x % 500) / 500)

        //当前在屏幕的元素的前一个和后一个元素的位置
        for (let offset of [-1, 0, 1]) {
          let pos = current + offset
          //避免负数给它加上自身的长度
          pos = (pos + children.length) % children.length

          children[pos].style.transition = "none"
          //减去自身pos
          children[pos].style.transform = `translateX(${- pos * 500 + offset * 500 + x % 500}px)`
        }
      }
      let up = event => {
        let x = event.clientX - startX
        position = position - Math.round(x / 500)

        //拖拽超过250往右
        for (let offset of [0, -Math.sign(Math.round(x / 500) - x + 250 * Math.sign(x))]) {
          let pos = position + offset;
          pos = (pos + children.length) % children.length

          children[pos].style.transition = ""
          children[pos].style.transform = `translateX(${- pos * 500 + offset * 500}px)`
        }
        document.removeEventListener("mousemove", move)
        document.removeEventListener("mouseup", up)
      }
      document.addEventListener("mousemove", move)
      document.addEventListener("mouseup", up)
    })

    let currentIndex = 0
    setInterval(()=>{
        let children = this.root.children
        let nextIndex = (currentIndex + 1) % children.length //不超过最大数
        
        let current = children[currentIndex]
        let next = children[nextIndex]
        next.style.transition = "none"
        next.style.transform = `translateX(${100 - nextIndex * 100}%)`
        setTimeout(()=>{
            next.style.transition = ""
            current.style.transform = `translateX(${-100 - currentIndex * 100}%)`
            next.style.transform = `translateX(${ - nextIndex * 100}%)`
            currentIndex = nextIndex
        },16)//16毫秒是浏览器一帧的时间
    },1500)

    return this.root
  }
  mountTo(parent) {
    parent.appendChild(this.render())
  }
}
