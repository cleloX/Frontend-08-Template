function drag(draggable){
    let baseX = 0, baseY = 0
    draggable.addEventListener('mousedown', (e) => {
      // let boxWidth = parseInt(getComputedStyle(draggable)['width']) / 2
      // let boxHeight = parseInt(getComputedStyle(draggable)['height']) / 2
      // console.log(boxHeight, boxWidth);
      let mouseStartX = e.clientX
      let mouseStartY = e.clientY
      console.log(mouseStartX, mouseStartY);
      let liberate = (e) => {
        // 在鼠标up时候记录一下当前位置，否贼每次都会回到（0,0）位置
        baseX += e.clientX - mouseStartX
        baseY += e.clientY - mouseStartY
        document.removeEventListener('mousemove', move)
        document.removeEventListener('mouseup', liberate)
      }
      let move = (e) => {
        console.log(e.clientX, e.clientY);
        draggable.style.transform = `translate(${baseX + e.clientX - mouseStartX}px, ${baseY + e.clientY - mouseStartY}px)`
        
      }

      
      document.addEventListener('mousemove', move)
      document.addEventListener('mouseup', liberate)
    })
}