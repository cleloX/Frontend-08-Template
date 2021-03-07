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
    <head>
    <style>
        #container{
            width: 500px;
            height: 500px;
            display: flex;
            background-color: rgb(255,255,255);
        }
        #container #my{
            width: 200px;
            height: 100px;
            background-color: rgb(255,0,0);
        }
        #container .c1{
            flex:1;
            background-color: rgb(0,255,0);
        }
    </style>
</head>
<body>
    <div>
        <div id="container">
            <div id="my"/>
            <div class="c1"/>
        </div>
    </div>
</body>
    </html>`)
  })
}).listen(8888)

console.log('running  8888.....');


