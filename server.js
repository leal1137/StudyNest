// ===== BACKEND (server.js) =====
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: '*' },
  pingTimeout: 5000,
  pingInterval: 2000
});

app.use(express.static('public'));

let users = {};

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  socket.on('join_room', ({ username, room }) => {
  socket.join(room);

  users[socket.id] = { username, room };

  // 1. Send confirmation ONLY to the user
  socket.emit('joined_room', {
    room,
    username
  });

  // 2. Notify everyone else in the room
  socket.to(room).emit('user_joined', username);
  });

  socket.on('send_message', (message) => {
    const user = users[socket.id];
    if (user) {
      io.to(user.room).emit('receive_message', {
        username: user.username,
        message
      });
    }
  });

  socket.on('disconnect', () => {
    const user = users[socket.id];
    if (user) {
      socket.to(user.room).emit('user_left', user.username);
      delete users[socket.id];
    }
    console.log('User disconnected:', socket.id);
  });
});

//Nytt
process.on('SIGINT', () => {
  io.emit('server_shutdown', 'Servern har stängts ner');

  setTimeout(() => {
    console.log('Servern stängs ner');
    process.exit(0);
  }, 1000);
});

server.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});