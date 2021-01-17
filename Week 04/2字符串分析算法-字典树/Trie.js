
  class Trie{
  constructor(){
    this.root = Object.create(null)
    this.$ = Symbol('$')
  }

  insert(word){
    let node = this.root
    for(let c of word){
      if(!node[c])
        node[c] = {}
      node = node[c]
    }
    if(!(this.$ in node))
    node[this.$] = 0  
    node[this.$]++
  }

  //獲取出现次数最多的单词及其次数
  //深度优先遍历
  most(){
    let maxNum = 0
    let maxWord = ''
    let dfs = (node,word) => {
      if(node[this.$] > maxNum){
        maxNum = node[this.$]
        maxWord = word
      } 
      for(let p in node){
          dfs(node[p], word+p)
        } 
    }
    dfs(this.root,'')
    console.log(maxWord,maxNum)
  }

  print(){
    console.log(this.root)
  }
}


let trie = new Trie()
for (let i = 0; i < 1000; i++) {
  let index = 0
  let s = ''
  while(index++ < 5){
    s += String.fromCharCode(parseInt(Math.random() * 26) + 'a'.charCodeAt())
  }
  // console.log('insert',s)
  trie.insert(s)
}
trie.insert('iudbdise')
trie.insert('sdfs')
trie.insert('aaaa')
trie.insert('aaaa')
trie.insert('aaaa')
trie.insert('aaaa')
trie.insert('aaaa')

trie.print()
trie.most()