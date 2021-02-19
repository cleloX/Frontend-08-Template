const { log } = require("console")

class Request{
  constructor(params){
    this.method = params.method || 'GET'
    this.host = params.host
    this.port = params.port || 80
    this.path = params.path || '/'
    this.body = params.body || {}
    this.headers = params.headers
    if(!this.headers['Content-type']) 
      this.headers['Content-type'] = 'application/x-www-form-urlencoded'
    if(this.headers['Content-type'] === 'application/x-www-form-urlencoded') 
      this.bodyText = Object.keys(this.body).map(key => `${key}=${encodeURIComponent(this.body[key])}`).join('&')
    else if(this.headers['Content-type'] === 'application/json')
      this.bodyText = JSON.stringify(this.body)
    console.log(this.bodyText);
    this.headers['Content-length'] = this.bodyText.length
  }

  send(){
    return new Promise((resolve, reject) => {
      // const response = new ResponseParser()
      resolve()
    })
  }
}



module.exports =  Request