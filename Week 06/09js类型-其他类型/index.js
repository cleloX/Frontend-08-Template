/**
 * 对象三要素：identifier ， state， behavior
 * 一定是对象的行为能改变对象的行为
*/

// 用 JavaScript 去设计狗咬人的代码,
// 分析：状态 -> 人被咬（人受伤了）， 动作 -> (被)咬

class Human{
  constructor(name){
    this.name = name
  }
  hurt(damage){
    console.log(this.name + damage);
  }
}