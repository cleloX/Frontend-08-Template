
  // 实现reactive的核心思想：收集依赖、设置依赖触发时机并触发依赖(在需要的时候触发依赖)
  // 局限：必须先调用get, 以后才能监听到set变化



  // 作为收集依赖的一个跳板
let usedReactives = []

// 使用map做二层包装：
  //第一层：用来确定是哪一个object触发，即{key:object，val：effect（依赖）属性的集合}
  //第二层：用来确定是哪一个属性触发，即{key：属性名，val：callback}
let callbacks = new Map()

// 全局reactives
let reactives = new Map()





function effect(callback){
  usedReactives = []
  callback()          // 通过回调函数，触发object的getter。暂时理解为，要在effect里面通过函数参数形式注册对象的属性
  usedReactives.forEach(arr => {
    if(!callbacks.has(arr[0])){  
      callbacks.set(arr[0], new Map())
    }
    if(!callbacks.get(arr[0]).has(arr[1])){
      callbacks.get(arr[0]).set(arr[1], [])
    }
    callbacks.get(arr[0]).get(arr[1]).push(callback)
  })

}


function reactive(object){
  if(reactives.has(object))
    return reactives.get(object)
  let proxy =  new Proxy(object,{
    //参数分别为：监听的对象、键、值
    set(obj, prop, val){
      if(typeof obj[prop] === "object")
        return reactive(obj)
      obj[prop] = val
      if(callbacks.get(obj)){
        if(callbacks.get(obj).get(prop))
          for (const cbk of callbacks.get(obj).get(prop)) {
            cbk(obj, prop, val)
          }
      }
      return obj.prop
    },
    get(obj, prop){
      if(typeof obj[prop] === "object")
        return reactive(obj)
      usedReactives.push([obj, prop])      // 收集依赖
      return obj[prop]
    }
  })
  reactives.set(object, proxy)
  return proxy
}


let obj = {
  name: 'tz',
  age: {
    a:22,
    b:21
  }
}
var proxy = reactive(obj)
effect((obj, prop, val) => {
  console.log(proxy.age.a)
  proxy.name
  console.log(`现在正在监听的对象是${obj},${prop}=${val}`, obj);
})
