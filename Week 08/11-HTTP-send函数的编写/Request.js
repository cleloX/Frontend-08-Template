const { log } = require("console")
const net = require('net')
const { compileFunction } = require("vm")
class Request{
  constructor(params){
    this.method = params.method || 'GET'
    this.host = params.host
    this.port = params.port || 80
    this.path = params.path || '/'
    this.body = params.body || {}
    this.headers = params.headers
    if(!this.headers['Content-Type']) 
      this.headers['Content-Type'] = 'application/x-www-form-urlencoded'
    if(this.headers['Content-Type'] === 'application/x-www-form-urlencoded') 
      this.bodyText = Object.keys(this.body).map(key => `${key}=${encodeURIComponent(this.body[key])}`).join('&')
    else if(this.headers['Content-Type'] === 'application/json')
      this.bodyText = JSON.stringify(this.body)
    // console.log(this.bodyText); 
    this.headers['Content-Length'] = this.bodyText.length
  }
  toString(){
    return `${this.method} ${this.path} HTTP/1.1\r
${Object.keys(this.headers).map(key => `${key}: ${this.headers[key]}`).join('\r\n')}\r\n
${this.bodyText}`
  }

  send(connection){
    return new Promise((resolve, reject) => {
      const parser = new ResponseParser()
      console.log('-this--',this,'----------');
      if(connection){
        connection.write(this.toString())
      }else{
        connection = net.createConnection({
          port: this.port,
          host: this.host
        }, function() {
          connection.write(this.toString())
        })
      }
      connection.on('data', data => {
        console.log('data.toString\r',data.toString(),'------------------------------');
        parser.receive(data.toString())
        if(parser.isFinished){
          resolve(parser.response)
          connection.end()
        }
      })
      connection.on('error', err => {
        console.log(err);
        reject(err)
        connection.end()
      })
    })
  }
}

class ResponseParser{
  constructor() {

  }
  receive(str){
    for(let i=0;i<str.length;i++){
      this.receiveChar(str.charAt(i))
    }
  }

  receiveChar(char) {
     
 }
}



void async function(){
  const request = new Request({
    method: 'POST',
    host: '127.0.0.1',
    port: 8000,
    headers:{
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body:{
      name:'tz',
      age: 23,
      a: 123456789
      // url: 'http://www.aa.com'
    }
  }) 

  let response = await request.send()
  console.log(response);
}()

// module.exports =  Request