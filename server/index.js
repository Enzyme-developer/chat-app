// const express = require('express');
// const { Server } = require("socket.io");
// const http = require('http');
// const PORT = process.env.PORT || 8000

// const router = require('./router')

// const app = express()
// const server = http.createServer(app);
// const io = socketio(server)

// io.on('connection', (socket) => {
//     console.log('we have a connection')

//     socket.on('disconnect' , ()=> {
//         console.log('user has left!')
//     })
// })

// app.use(router)

// server.listen(PORT, () => console.log(`server has started on port ${PORT}`))

const express = require("express");
const { createServer } = require("http");
const { Server } = require("socket.io");
const { callback } = require("util");
const { addUser , getUser , getUserInRoom , removeUser} = require('./users')
const PORT =  5000



const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
    cors: {
        origin: "*",
    }
  });

const router = require('./router')
 
io.on('connect', (socket) => {
    socket.on('join', ({ name, room }, callback) => {
      const { error, user } = addUser({ id: socket.id, name, room });
  
      if(error) return callback(error);
  
      socket.join(user.room);
  
      socket.emit('message', { user: 'admin', text: `${user.name}, welcome to room ${user.room}.`});
      socket.broadcast.to(user.room).emit('message', { user: 'admin', text: `${user.name} has joined!` });
  
      io.to(user.room).emit('roomData', { room: user.room, users: getUserInRoom(user.room) });
  
      callback();
    });
  
    socket.on('sendMessage', (message, callback) => {
      const user = getUser(socket.id);
  
      io.to(user.room).emit('message', { user: user.name, text: message });
  
      callback();
    });
  
    socket.on('disconnect', () => {
      const user = removeUser(socket.id);
  
      if(user) {
        io.to(user.room).emit('message', { user: 'Admin', text: `${user.name} has left.` });
        io.to(user.room).emit('roomData', { room: user.room, users: getUserInRoom(user.room)});
      }
    })
  });

app.use(router)

httpServer.listen(PORT, () => console.log(`server has started on port ${PORT}`))