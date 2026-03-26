const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const User = require('./user');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: { origin: '*' }
});
    
app.use(express.static('public'));
    
let listUsers = {};
io.on('connection', (socket) => {
    console.log('User connected:', socket.id);

    socket.on('login', (username) => {
        listUsers[socket.id] = new User(username);
        console.log('User logged in:', username);
    });

    socket.on('join_room', (room) => {
        socket.join(room);
        if (listUsers[socket.id]) {
            listUsers[socket.id].room = room;

            // 1. Send confirmation ONLY to the user
            socket.emit('joined_room', {
                room: listUsers[socket.id].getRoom(),
                //username: listUsers[socket.id].getUsername()
            });

            // 2. Notify everyone else in the room
            socket.to(room).emit('user_joined', listUsers[socket.id].getUsername());
        }
    });

    socket.on('send_message', (message) => {
        const user = listUsers[socket.id];
        if (user) {
        io.to(user.room).emit('receive_message', {
            username: user.username,
            message
        });
        }
    });

    socket.on('disconnect', () => {
        const user = listUsers[socket.id];
        if (user) {
            socket.to(user.room).emit('user_left', user.username);
            delete listUsers[socket.id];
        }
        console.log('User disconnected:', socket.id);
    });
});

server.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});