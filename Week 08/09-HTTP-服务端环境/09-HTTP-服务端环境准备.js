const { log } = require('console')
const http = require('http');
const { type } = require('os');
http.createServer((request, response) => {
  request.on('error', (err) => {
    console.log(err);
  }).on('data', (data) => {
    let body = data
    
  }).on('end', () => {
    response.writeHead(200,{
      'Content-type': 'text/html'
    })
    response.end('<p>hello</p>')
  })
}).listen(8000)