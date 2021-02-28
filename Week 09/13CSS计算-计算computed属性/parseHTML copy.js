let currentToken = null
let currentAttribute = null
let currentTextNode = null

const css = require('css')
let rules = []
function addCSSRules(text){
  let ast = css.parse(text)
  console.log(JSON.stringify(ast))
  rules.push(...ast.stylesheet.rules)
}

//这里selector都是简单选择器：.a  #a  tagName
function matcher(element, selector){
  //判断这个元素是否是文本节点；如果是文本节点，就不用去看它到底跟selector是否匹配
  if(!selector || !element.attributes)
      return false;
  
  if(selector.charAt(0) == "#"){
      //id选择器
      var attr = element.attributes.filter(attr => attr.name === "id")[0];
      if(attr && attr.value === selector.replace("#", ''))
          return true;
  }else if(selector.charAt(0) == "."){
      //类选择器
      var attr = element.attributes.filter(attr => attr.name === "class")[0]
      if(attr && attr.value === selector.replace(".", ''))
          return true;
  }else{
      //tagName选择器
      if(element.tagName === selector){
          return true;
      }
  }
  return false;
}

//计算优先级四元组
function specificity(selector){
  var p = [0, 0, 0, 0]; // 优先级从左到右  inline，id， class， tag 选择器
  var selectorParts = selector.split(" ");
  for(var part of selectorParts){
    if(part.charAt(0) == "#"){
      p[1] += 1;
    }else if(part.charAt(0) == "."){
      p[2] += 1;
    }else{
      p[3] += 1;
    }
  }
  return p;
}

//比较优先级
function compare(sp1, sp2){
  if(sp1[0] - sp2[0])
    return sp1[0] - sp2[0];
  if(sp1[1] - sp2[1])
    return sp1[1] - sp2[1];
  if(sp1[2] - sp2[2])
    return sp1[2] - sp2[2];
  
  return sp1[3] - sp2[3];
}

function computedCSS(element){
  // console.log(rules, element)
  /* + 在计算css，需要知道元素的全部父元素才能判断元素与规则是否匹配 
    + 从上一个步骤中可以得到父元素
    +  因为首先获取的是“当前元素”，所以匹配顺序从内到外  */
  let elements = stack.slice().reverse()

  if(!element.computedCSS)
    element.computedCSS = {}

  for(let rule of rules){
    var selectorParts = rule.selectors[0].split(" ").reverse();
    //当前元素和简单选择器最后一个
    if(!matcher(element, selectorParts[0]))
        continue;

    let matched = false;
    // 双循环选择器和元素父元素
    var j = 1;      //当前选择器的位置
    for(var i = 0; i < elements.length; i++){
      if(matcher(elements[i], selectorParts[j])){
        j++;
      }
    }
    //结束的时候检查是否所有的选择器已经都被匹配到了，匹配到了，认为是个匹配成功的
    if(j >= selectorParts.length)
      matched = true;

    if(matched){
      // console.log("Element", element, "matched rule", rule);
      var sp = specificity(rule.selectors[0]);
      var computedStyle = element.computedStyle;
      for(var declaration of rule.declarations){
        if(!computedStyle[declaration.property])
          computedStyle[declaration.property] = {};//用一个对象来保存属性的值
        
        if(!computedStyle[declaration.property].specificity){
          computedStyle[declaration.property].value = declaration.value;
          computedStyle[declaration.property].specificity = sp;
        }else if(compare(computedStyle[declaration.property].specificity, sp) < 0){
            //比较，旧的更小的话，就让新的区域覆盖它；根据这个来完成优先级的判断
          computedStyle[declaration.property].value = declaration.value;
          computedStyle[declaration.property].specificity = sp;
        }  
      }
    }
  }
}
let stack = [{type:'document', children:  []}]
// 全局输出函数，输出接口
// 状态机作用：在每一个状态里面可以进行逻辑计算
// 逐步完成构建token里面的内容
function emit(token){
  
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


    computedCSS(element)

    top.children.push(element)
    element.parent = top

    if(!token.isSelfCloseTag){
      stack.push(element)
    }

    currentTextNode = null
  }else if(token.type == 'endTag'){  // 自封闭标签
    if(top.tagName != token.tagName){
      console.log(top)
      console.log(token)
      // 配对不对报错，未做兼容性处理
      throw new Error('Tag start end does not match')
    }else{
      // console.log(top)
      // ------------遇到style标签，执行css添加规则（依赖css module）----------------
      if(top.tagName == 'style'){
        addCSSRules(top.children[0].content)
      }
      stack.pop()
    }
    currentTextNode = null
  }else if(token.type == 'text'){ 
    if(currentTextNode == null){
     currentTextNode = {
       type: 'text',
       content: ''
     }
     top.children.push(currentTextNode)
    }
    currentTextNode.content += token.content
  }
  
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