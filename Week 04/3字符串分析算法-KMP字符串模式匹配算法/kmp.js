function kmp(source, pattern){
  //计算跳转table
  //table，例如：
  // a b a b a b c
  // 0 0 0 1 2 3 4
  //4代表的意义：c前面的4个字符 和 整个字符串的前4个字符相等
  //因此，自重复一定是从头开始的，例如cabab不算自重复
  let table =new Array(pattern.length).fill(0)
  {
    let i = 1    //从子串的第一个元素开始(自重复的开始位置)
    let j = 0    //已经重复的元素数
    while(i < pattern.length){
      if(pattern[i] == pattern[j]){
        i++
        j++
        table[i] = j
      }else{
        if(j > 0){
          j = table[j]
        }else{
          i++
        }
      }
    }
  }

  {
    let i = 0
    let j = 0
    while(i < source.length){
      if(source[i] === pattern[j]){
        i++
        j++
      }else{
        if(j > 0){
          j = table[j]
        }else{
          i++
        }
      }
      if(j === pattern.length)
        return true
    }
    return false
  }

  console.log(table)
}

kmp('','abcdabce')
kmp('','aabaaad')
kmp('','abababc')
console.log(kmp('abababc','abc'))