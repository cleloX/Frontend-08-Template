// 写一段 JS 的函数，把一个 string 它代表的字节给它转换出来，用 UTF8 对 string 进行遍码。

// function buffer(string){
//   let rgx = "(?:[^"\n\\\r\u2028\u2029]|\\(?:['"\\bfnrtv\n\r\u2028\u2029]|\r\n)|\\x[0-9a-fA-F]{2}|\\u[0-9a-fA-F]{4}|\\[^0-9ux'"\\bfnrtv\n\\\r\u2028\u2029])*"
//   // let str = new RegExp(rgx)
//   let str = str.RegExp()
//   console.log(str)
// }

function UTF8_Encoding(str){
  let encoding = ''
  for (let i = 0; i < str.length; i++) {
    encoding += str[i].codePointAt(0).toString(16)
  }
  console.log(encoding)
  return encoding
}

UTF8_Encoding('s@#%$中国tr')