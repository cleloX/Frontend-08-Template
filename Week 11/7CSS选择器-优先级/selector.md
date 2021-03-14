 div#a.b .c[id=x]  0-1-3-1(1 id, 2 class和1 attribute， 1 tag)
 #a:not(#b) 0-2-0-0 （2 id not内部的选择武器影响优先级）
 *.a 0-0-1-0（1 class）
 div.a 0-0-1-1