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



// 重写普通标签的方法，使其能使用我们自定义的方法，比如mountTo
class ElementWrapper{
  constructor(type){
    this.root = document.createElement(type)
  }
  setAttribute(name, value){
    this.root.setAttribute(name, value)
  }
  appendChild(child){
    // this.root.appendChild(child)
    child.mountTo(this.root)
  }
  mountTo(parent){
    parent.appendChild(this.root)
  }
}

// 重写普通标签的方法，使其能使用我们自定义的方法，比如mountTo
class TextNodeWrapper{
  constructor(type){
    this.root = document.createTextNode(type)
  }
  setAttribute(name, value){
    this.root.setAttribute(name, value)
  }
  appendChild(child){
    // this.root.appendChild(child)
    child.mountTo(this.root)
  }
  mountTo(parent){
    parent.appendChild(this.root)
  } 
}

class CpnA{
  constructor(){
    this.root = document.createElement('div')
  }
  setAttribute(name, value){
    this.root.setAttribute(name, value)
  }
  appendChild(child){
    // this.root.appendChild(child)
    child.mountTo(this.root)
  }
  mountTo(parent){
    parent.appendChild(this.root)
  }
}



console.log(11)
// let a = new ElementWrapper('div')
// console.log(a)
let a = <div id="aaa">
  helllo
  <p>tt</p>
</div>

// element函数的作用：
// 根据type（标签或者组件名）、attributes属性（属性对象，包括属性名和属性值）、children来创建一个真实的element 
function creatElement(type, attributes, ...children) {
  let element;
  if(typeof type === 'string')
    // element = document.createElement(type);  // 普通的标签
    element = new ElementWrapper(type);  // 改用elementwrapper，让原生的div可以使用mountTo方法挂载
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
      // child = document.createTextNode(child);  // 文本节点使用createTextNode创建新的node节点
      child = new TextNodeWrapper(child);  // 改用TextNodeWrapper，重写textnode的相关操作，让原生的textnode可以使用自定的方法mountTO
    }
    element.appendChild(child);
    // child.mountTo(element)
  }

  return element
}


// document.body.appendChild(a)
a.mountTo(document.body)