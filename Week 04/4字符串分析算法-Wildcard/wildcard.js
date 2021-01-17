function find(source, pattern) {
  //统计*数量
  let starCount = 0;
  for (let i = 0; i < pattern.length; i++) {
      if (pattern[i] === '*') {
          starCount ++;
      }
  }
  //没有*的情况，逐一对比
  if (starCount === 0) {
      for (let i = 0; i < pattern.length; i++) {
          if (pattern[i] !== source[i] && pattern[i] !== '?')
              return false
      }
      return
  }

  let i = 0;
  let lastIndex = 0;
  for (i = 0; pattern[i] !== '*'; i++) {
      if (pattern[i] !== source[i] && pattern[i] !== '?')
          return false
  }
  lastIndex = i;
  for (let j = 0; j < starCount - 1; j++) {
      i++;
      let subPattern = '';
      while (pattern[i] !== '*') {
          subPattern += pattern[i];
          i++;
      }
      let reg = new RegExp(subPattern.replace(/\?/g, '[\\s\\S]'), 'g');
      reg.lastIndex = lastIndex;
      if (!reg.exec(source))
          return false;
      lastIndex = reg.lastIndex;
  }

  for (let j = 0; j < source.length - lastIndex && pattern[pattern.length - j] !== '*'; j++) {
      if (pattern[pattern.length - j] !== source[source.length - j] && pattern[pattern.length - j] !== '?') {
          return false
      }
  }
  return true
}

console.log(find('abdabfabxbafishc','a*?b*bx*c'))