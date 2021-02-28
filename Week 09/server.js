const { log } = require('console')
const http = require('http');
const { type } = require('os');
http.createServer((request, response) => {
  let body = []
  request.on('error', (err) => {
    console.log(err);
  }).on('data', (chunk) => {
    body.push(chunk)
    console.log(chunk);
  }).on('end', () => {
    body = Buffer.concat(body).toString()
    console.log(body);
    response.writeHead(200,{
      'Content-Type': 'text/html'
    })
    response.end(`<html lang="en">
    <style>
      div p .box{
        color:red;
      }
      .left, #right{
        border: 1px solid green;
      }
    </style>
    <body>
      <script></script>
    </body>
    </html>`)
  })
}).listen(8000)

console.log('running  8000.....');


