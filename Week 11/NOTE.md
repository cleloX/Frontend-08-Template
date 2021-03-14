## css语法
  w3.org/TR/CSS21/grammar.html#q25.0
+ css总体结构
  + @charset
  + @import
  + rules 
    + @media
    + @page
    + rule

+ CSS规则
  + 选择器（selector）
    + w3.org/TR/selector-3/#grammar
    + w3.org/TR/selector-4
  + 声明（declaration）
    + key
      + w3.org/TR/css-variables（声明 -> :root{--variable:value}
      使用 -> var(--variable)）
    + value
      + calc函数就算


## 选择器优先级
important > inline > id > (pseudo)class | attribute > element 

## 伪类选择器
  + :any-link
  + :link :visited
  + :hover
  + :active
  + :focus
  + :target

  树结构
  + :empty (子元素是否为空)
  + :nth-child()
  + :nth-last-child()
  + :first-child    :last-child  :only-child

  逻辑型
  + :not
  + :where  :has

  ## 伪元素
  相当于通过伪元素向页面添加不存在的元素
  (可以加content)
  + ::before
  + ::after

  + ::first-line
  + ::first-letter