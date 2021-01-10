let regexp = /([0-9\.]+)|([ \t]+)|([\r\t]+)|(\+)|(\-)|(\*)|(\/) /g
let dictionary = ['Number', 'Whitespace', 'Terminator', '+', '-', '*', '/']

function regexpCheck(str){
  let result = null
  while(1){
    result = regexp.exec(str)
    if(!result) break
     console.log(result)
    for (let i = 1; i <= dictionary.length; i++) {
      if(result[i]) console.log(dictionary[i-1])
    }
    
  }
}


regexpCheck("1 + 2 * 3 - 5")