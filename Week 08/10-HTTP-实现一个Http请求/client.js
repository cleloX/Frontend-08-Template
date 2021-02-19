const Request = require('./Request')
void function(){
  const request = new Request({
    method: 'post',
    headers:{
      'Content-type': 'application/x-www-form-urlencoded'
    },
    body:{
      name:'tz',
      age: 22,
      url: 'http://www.aa.com'
    }
  }) 

  let response = request.send()
  console.log(response);
}()