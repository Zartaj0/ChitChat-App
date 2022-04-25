const path = require('path');
const http = require('http');
const express = require('express');
const app = express();
const server = http.createServer(app)
const socketio = require('socket.io');
const messageFormat = require('./utils/message')
const {
  userJoin,
  getCurrentUser,
  userLeave,
  getRoomUsers,
} = require('./utils/users')

const io = socketio(server)


app.use(express.static(path.join(__dirname, 'public')))

io.on('connection', (socket) => {

  socket.on('joinRoom', ({ username, room }) => {

    const user = userJoin(socket.id,username,room)
    socket.join(user.room)

    socket.emit('message', messageFormat('assistant', `hii ${user.username} Welcome to Chatcord`))

    socket.broadcast.to(user.room).emit('message', messageFormat('assistant', `Stop everyone ${user.username} just entered the room `));
   
    io.to(user.room).emit('roomUsers',{
      room:user.room,
      users:getRoomUsers(user.room)
    });
  })

  socket.on('chatMessage', (msg) => {
    const user = getCurrentUser(socket.id)
    io.to(user.room).emit('message', messageFormat(user.username, msg))

  })
  
 
  socket.on('disconnect', () => {
    const user = userLeave(socket.id) 

if (user) {
  io.to(user.room).emit('message', messageFormat('assistant', ` ${user.username} left the chat`))
  
}    
    io.to(user.room).emit('roomUsers',{
      room:user.room,
      users:getRoomUsers(user.room)
    });
  })
})

const PORT = process.env.PORT || 5000

server.listen(PORT, () => {
  console.log(`server running at ${PORT}`);
})
