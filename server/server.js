
var http = require("http");
var fs = require("fs");
var dotenv = require("dotenv").config();


var server = http.createServer(function(request,response) {
    fs.readFile("./index.html" , function(err,content) {
      if(err) {
          console.log("Error==>",err);
      } else {
          response.writeHead(200,{ "Content-Type" : "text/html" });
          response.write(content);
          response.end();
      }
    })
})


console.log("Server is listening on port ",process.env.port);

var io = require("socket.io").listen(server);

io.sockets.on('connection' , function(socket) {
    socket.emit('welcomeMessageFromServer',"Hi Client !! You are connected ");

    socket.on('clients_name',function(name){
        socket.name = name;
        console.log( socket.name + " is connected..");
    })

    socket.on('messageFromClientToServer' , function(msg) {
        console.log(socket.name + " is saying " + msg);
    })

    setTimeout(function() {
        socket.emit('msgFromServerToClient' , "Hi client !!! How are you ??");
        socket.broadcast.emit('msgToAllClients' ,'Hi clients.. all good ??');
    },5000);
    
    
})
server.listen(process.env.port);