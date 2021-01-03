class Sorted{
  constructor(data, compare){
    this.data = data.slice()
    this.compare = compare || ((a,b) => a - b)
  }

  take(){
    if(!this.data.length) return
    let minVal = this.data[0]
    let minIndex = 0
    for (let i = 1; i < this.data.length; i++){
      if(this.compare(this.data[i] , minVal) < 0){
        minVal = this.data[i]
        minIndex = i
      }
    }
    //操作目的：在数组中取出最小值（同时数组长度-1）
    //不使用splice函数原因：1.splice时间复杂度为O(N)，使用下面这种方法为O(1)
    this.data[minIndex] = this.data[this.length-1]
    this.data.pop()
    return minVal
  }

  give(v){
    this.data.push(v)
  }

  get length(){
    return this.data.length
  }
}


// let sor = new Sorted([4,5,465,,24,5,0,5])
// console.log(sor.take())