// import drag from './drag'
function range(draggable, container){
    let ranges = []
    for (let i = 0; i < container.childNodes[0].textContent.length; i++) {
      let range = document.createRange()
      range.setStart(container.childNodes[0], i)
      range.setEnd(container.childNodes[0], i)
      ranges.push(range)
      console.log(range.getBoundingClientRect())
      
    }
    function getNearest(x, y){
      let min = Infinity
      let nRange = null 
      ranges.forEach(range => {
        let rect = range.getBoundingClientRect()
        let distance = (rect.x - x) ** 2 + (rect.y - y) ** 2
        if(distance < min){
          min = distance
          nRange = range
        }
      })
      return nRange
    }
    document.addEventListener('selectstart', e => e.preventDefault())

    drag(draggable,getNearest)

}