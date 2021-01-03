#一、地图的可视化操作
 + 使用async和await实现“延迟渲染”，达到可视化的目的
 ```javaScript
    function sleep(time){
      return new Promise((resolve, reject) => {setTimeout(resolve,time)})
    }
 ```


Q:
class Sorted需要加一个getter，否则实例中无法得到sorted.length(sorted.data.length)