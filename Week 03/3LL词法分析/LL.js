let regexp = /([0-9\.]+)|([ \t]+)|([\r\t]+)|(\+)|(\-)|(\*)|(\/) /g
let dictionary = ['Number', 'Whitespace', 'Terminator', '+', '-', '*', '/']
console.log(regexp.lastIndex)
function* tokenize(resource){
  let lastIndex = regexp.lastIndex
  let result
  while(1){
    lastIndex = regexp.lastIndex
    result = regexp.exec(resource)
    if(!result) break
    if(regexp.lastIndex - lastIndex > result[0].length) {
     console.log('出现未识别的符号')
     break
      
    }

    let token = {
      type:null,
      val:null
    }
    for (let i = 1; i < dictionary.length; i++) {
      if(result[i])
        token.type = dictionary[i-1]
    }
    token.val = result[0]
    yield token

  } 
  yield {type: 'EOF'}
}

// for(let item of tokenize('1 + 2 * (5 - 3)')){
//   console.log(item)
// }