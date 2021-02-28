# 一、HTML的解析
<hr style="border: 1px dashed #987cb9; width: 49%;display:inline-block"/>词法分析<hr style="border: 1px dashed #987cb9; width: 49%; display:inline-block"/>
## 1.浏览器解析后端返回的html--解析模块parseHTML
+ 在客户端接收到server端返回的response信息后
+ 调用parseHTML
+ **注意：实际上server端返回的response是分段返回的，因此调用parseHTML也是分段解析的。本次为了方便逻辑和代码，只解析一次**

## 2.使用（有限）状态机FSM实现html的解析
+ 在HTML标准中，已经规定了HTML的状态[https://ecma-international.org/](https://ecma-international.org/ "ECMA标准")
+ **注意：解析有许多复杂的状态，toy-browser只截取简单的一部分**

## 3.解析标签
+ 标签分类
  + 开始标签
  + 结束标签
  + 自封闭标签
+ 暂时只解析便签，不解析属性  

## 4.创建元素
+ 状态机： 状态迁移， 加入业务逻辑（比如说，创建token和emit的过程）
+ 标签结束状态提交token

## 5.处理属性
+ 属性值分为：
 + 单引号
 + 双引号
 + 无引号
+ 处理属性方法和标签类似
+ 属性结束，将属性添加到标签token上

<hr style="border: 1px dashed #987cb9; width: 49%;display:inline-block"/>词法分析<hr style="border: 1px dashed #987cb9; width: 49%; display:inline-block"/>
可使用栈实现（外加特殊状态）

## 6.用token构建DOM树
+ 使用栈构建DOM树
 + 开始标签入栈，结束标签出栈
 + 自封闭标签入栈后里面出栈
+ 任何元素的父元素是他入栈前的栈顶

## 7.文本节点添加到DOM树
+ 多个文本节点合并
+ 处理方式和自封闭标签类似

## 8.收集css规则
 + css计算：将css属性应用到选择器对应的元素上面
 + 遇到style标签，将css规则保存（将style里面的内容以文本形式保存）
 + 调用css。parse解析css规则

## 9.添加调用
+ 大部分的选择器在startTag开始匹配，
+ 理论上分析元素时，CSS规则已经收集完毕
**注意：真实浏览器中，style可能在body中，需要重新进行css计算，这里忽略**

## 10.获取父元素序列

## 11.选择器与元素的匹配

## 12.计算选择器与元素的匹配

## 13.生成computed属性

## 14.specificity的计算逻辑