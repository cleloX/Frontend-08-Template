{
  //广度优先算法的实现
  function path(map, start, end){
    let queue = [start]
    function insert(x, y){
      if(x>99 || x<0 ||  y<0 || y>99) return
      if(map[100*x+y]) return
      map[100*x+y] = 2
      queue.push([x,y])

    }

    while(queue.length){
      let now = queue.shift()
      console.log(now)
      if(now[0] == end[0] && now[1] == end[1]) return '可以抵达'

      //广度优先搜索，每次检索从当前格子的周围4格，渐进层层
      insert(now[0]+1, now[1])
      insert(now[0]-1, now[1])
      insert(now[0], now[1]+1)
      insert(now[0], now[1]-1)

    }

    return '无法抵达'
  }


}