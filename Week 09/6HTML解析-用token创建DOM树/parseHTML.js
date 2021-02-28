let currentToken = null
let currentAttribute = null

let stack = [{type:'document', children:[]}]
// 全局输出函数，输出接口
// 状态机作用：在每一个状态里面可以进行逻辑计算
// 逐步完成构建token里面的内容
function emit(token){
  if(token.type === 'text') return
  let top = stack[stack.length-1]

  if(token.type === 'startTag'){
    let element = {
      type: 'element',
      children: [],
      attributes: []
    }

    element.tagName = token.tagName
    for (const p in token) {
      if(p != 'type' && p != 'tagName'){
        element.attributes.push({
          name: p,
          value: token[p]
        })
      }
    }

    top.children.push(element)
    element.parent = top

    if(!token.isSelfCloseTag){
      stack.push(element)
    }

    currentTextNode = null
  }else if(token.type == 'endTag'){  // 自封闭标签
    if(top.tagName != token.tagName){
      // 配对不对报错，未做兼容性处理
      throw new Error('Tag start end does not match')
    }else{
      stack.pop()
    }
  }
  currentTextNode = null
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
      tagName:''
    }
    return tagName(c)
  }
  else return
}

function endTagOpen(c){
  if(c.match(/^[a-zA-Z]$/)){
    currentToken = {
      type: 'endTag',
      tagName: ''
    }
    return tagName(c)
  }
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
    return tagName // 还在标签名里面
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
  else if(c == '>' || c == EOF || c == '/'){
    return afterAttributeName(c)
  }
  else{
    currentAttribute = {
      name:'',
      value:''
    }
    return attributeName(c)
  }
}
function attributeName(c){
  // 此时一个属性已经结束<div class='a' ,后面可以跟空格，/， >，此时标签结束了
  if(c.match(/^[\t\n\f ]$/) || c =='/' || c == '>' || c == EOF) return afterAttributeName(c)
  else if(c == '=') return beforeAttributeValue
  else if(c == '\u0000'){
    
  }else if(c == '\"' || c == "\'" || c == '<'){

  }else{
    currentAttribute.name += c.toLowerCase()
    return attributeName
  }
}

// 属性后面接等于号，等号后面接属性值等分几种情况
function beforeAttributeValue(c){
  if(c.match(/^[\t\n\f ]$/) || c =='/' || c == '>' || c == EOF) return afterAttributeName(c)
  else if(c == '\'') return singleQuotedAttributeValue
  else if(c == '\"') return doubleQuotedAttributeValue
  else if(c == '>'){

  }
  else{
    return UnquotedAttributeValue(c)
  }
}

function singleQuotedAttributeValue(c){
  if(c == '\''){
    currentToken[currentAttribute.name] = currentAttribute.value
    return afterQuotedAttributeValue
  }else if(c == '\u0000'){
      
  }else if(c == EOF){

  }else{
    currentAttribute.value += c
    return singleQuotedAttributeValue
  }
}

function doubleQuotedAttributeValue(c){
  if(c == '\"'){
    currentToken[currentAttribute.name] = currentAttribute.value
    return afterQuotedAttributeValue
  }else if(c == '\u0000'){
      
  }else if(c == EOF){

  }else{
    currentAttribute.value += c
    return doubleQuotedAttributeValue
  }
}

// 只有当属性值结束（"" 和 ''包起来的）后才会进入
function afterQuotedAttributeValue(c){
  if(c.match(/^[\t\n\f ]$/)){
    return beforeAttributeNAme 
  }
  else if(c == '/'){
    return selfCloseStartTag
  }else if(c == EOF){

  }else if(c == '>'){
    currentToken[currentAttribute.name] = currentAttribute.value
    emit(currentToken)
    return data
  }else{
    currentAttribute.value += c
    return doubleQuotedAttributeValue
  }
}

function UnquotedAttributeValue(c){
  if(c.match(/^[\t\n\f ]$/)){
    currentToken[currentAttribute.name] = currentAttribute.value
    return beforeAttributeNAme 
  }
  else if(c == '/'){
    currentToken[currentAttribute.name] = currentAttribute.value
    return selfCloseStartTag
  }else if(c == '\u0000'){
      
  }else if(c == EOF){

  }else if(c == '>'){
    currentToken[currentAttribute.name] = currentAttribute.value
    emit(currentToken)
    return data
  }else if(c == '\'' || c == '\"' || c == '=' || c == '`' || c == '<'){

  }
  else{
    currentAttribute.value += c
    return UnquotedAttributeValue
  }
}

function selfCloseStartTag(c){
  if(c == '>'){
    currentToken.isSelfCloseTag = true
    emit(currentToken)
    return data
  }else if(c == 'EOF'){

  }else{

  }
}

function afterAttributeName(c){
  if(c.match(/^[\t\n\f ]$/)){
    return afterAttributeName 
  }else if(c == '/'){
    return selfCloseStartTag
  }else if(c == '='){
    return beforeAttributeValue
  }else if(c == EOF){

  }else if(c == '>'){
    currentToken[currentAttribute.name] = currentAttribute.value
    emit(currentToken)
    return data
  }else{
    currentToken[currentAttribute.name] = currentAttribute.value
    currentToken = {
      name:'',
      value:''
    }
    return attributeName(c)
  }
}

module.exports.parseHTML = function parseHTML(html){
  let state = data
  for (const c of html) {
    state = state(c)
  }
  state(EOF)
}