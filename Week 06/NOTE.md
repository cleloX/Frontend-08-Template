## 数据类型 （7种 + bigint）
装箱操作
Number、String 和 Boolean，三个构造器是两用的，当跟 new 搭配时，它们产生对象，当直接调用时，它们表示强制类型转换。
 #### 基本数据类型
+ Number
   + 比较浮点数的正确方法 ：Math.abs(0.1 + 0.2 - 0.3) <= Number.EPSILON
   + 无法直接比较浮点数：1.进制转换时精确度的损失 
+ Boolean
+ String
+ Symbol


 #### 特殊数据类型
+ Null：关键字
+ Undefined ：一个全局变量

#### 引用数据类型
最直白的就是存储的是内存地址：1.赋值的时候引用原始对象的内存地址（使用=克隆复杂数据类型会出现数据的丢失等问题）2.[] == [] -> false
+ Object

#### 特殊行为的对象
+ Array：Array 的 length 属性根据最大的下标自动发生变化。
+ Object.prototype：作为所有正常对象的默认原型，不能再给它设置原型了。
+ String：为了支持下标运算，String 的正整数属性访问会去字符串里查找。
+ Arguments：arguments 的非负整数型下标属性跟对应的变量联动。
+ 模块的 namespace 对象：特殊的地方非常多，跟一般对象完全不一样，尽量只用于 import 吧。
+ 类型数组和数组缓冲区：跟内存块相关联，下标运算比较特殊。
+ bind 后的 function：跟原来的函数相关联。




？？？？？？
关于number的视频解释还没搞懂，感觉和自己之前编译原理里面学的有些不一样？？？？