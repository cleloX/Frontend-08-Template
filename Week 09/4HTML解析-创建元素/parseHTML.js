let currentToken = null

// 全局输出函数，输出接口
// 状态机作用：在每一个状态里面可以进行逻辑计算
// 逐步完成构建token里面的内容
function emit(token){

  console.log(token);
}





const EOF = Symbol('EOF')

// 初始状态，判断是否为一个开始标签
function data(c){
  if(c === '<') return tagOpen  // 开始标签肯定以<开头
  else if(c === EOF){
    emit({
      type:'EOF'
    })
    return
  }
  else{
    emit({
      type:'text',
      content:c
    })
    return data
  }
}

function tagOpen(c){
  if(c === '/') return endTagOpen    // 以</ 开始的标签为结束标签,是结束标签的开头
  else if(c.match(/^[a-zA-Z]$/)){
    currentToken = {
      type:'startTag',    // <cc 开头统一识别为开始标签，没有单独做自封闭标签type，而是用一个isSelfCloseTag来表示
      tagNAme:''
    }
    return tagName(c)
  }
  else return
}

function endTagOpen(c){
  if(c.match(/^[a-zA-Z]$/)) return tagName(c)
  else if(c == '>'){}
  else if(c == 'EOF'){}
  else{}
}

function tagName(c){
  // tagname的结束是空白（后面接属性），标准的空格有4种（tab，换行，禁止prohibited，空格）
  if(c.match(/^[\t\n\f ]$/)) return beforeAttributeNAme 
  else if(c == '/') return selfCloseStartTag   // <tag/ 这是自封闭标签
  else if(c.match(/^[a-zA-Z]$/)){
    currentToken.tagName += c.toLowerCase()
     return tagName(c) // 还在标签名里面
  }
  else if(c == '>'){
    emit(currentToken)
    return data
  }
  else return tagName
}

function beforeAttributeNAme(c){
  if(c.match(/^[\t\n\f ]$/)) return beforeAttributeNAme 
  else if(c == '=') return beforeAttributeNAme
  else if(c == '>') return data
  else return beforeAttributeNAme
}

function selfCloseStartTag(c){
  if(c == '>'){
    currentToken.isSelfCloseTag = true
    return data
  }else if(c == 'EOF'){

  }else{

  }
}

exports.parseHTML = function parseHTML(html){
  let state = data
  for (const c of html) {
    state = state(c)
  }
  state(EOF)
}