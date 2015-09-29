var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var port = process.env.PORT || 3000;

app.use('/public', express.static(__dirname + '/public'));
var lastMessage;

app.get('/', function(req, res){
  res.sendFile(__dirname + '/views/index.html');
});

io.on('connection', function(socket){
  if (lastMessage) {
    io.emit(lastMessage.event, lastMessage.content);
  }

  socket.on('reset', function() {
    io.emit('clear');
    lastMessage = {
      event: 'clear'
    };
  });

  socket.on('score', function(msg) {
    io.emit('update', msg);
    lastMessage = {
      event: 'update',
      content: msg
    };
  });

  socket.on('gameOver', function(msg) {
    io.emit('over', msg);
    lastMessage = {
      event: 'over',
      content: msg
    };
  })
});

http.listen(port, function(){
  console.log('listening on *:' + port);
});