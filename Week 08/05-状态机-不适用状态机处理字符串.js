/**
 * 判断某一个字符串内是否含有  'abcdef' 
*/

function hasStr(str){
  let A = B = C = D = E = false
  for (const c of str) {
    if(c === 'a') A = true
    else if(c === 'b' && A) B = true,A = false
    else if(c === 'c' && B) C = true, B = false
    else if(c === 'd' && C) D = true, C = false
    else if(c === 'e' && D) E = true, D = false
    else if(c === 'f' && E) return true
    else{
      A = B = C = D = E = false
    }
  }
  return false
}

console.log(hasStr('strabcdef'));
console.log(+true);