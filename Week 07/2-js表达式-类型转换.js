const StringToNumber = (str,n)=>{
  return Number(Number(str).toString(n))
  }
const NumberToString = (value,n) => {
  return value.toString(n)
  }

  console.log(StringToNumber(11,2))