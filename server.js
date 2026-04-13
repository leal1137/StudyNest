//server.js
require('dotenv').config();

const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const jwt = require('jsonwebtoken');

const SECRET = process.env.SECRET;
const pool = require('./db/pool');
const authRoutes = require('./routes/auth');
const roomRoutes = require('./routes/rooms');
const { router: userRoutes } = require('./routes/users');
const User = require('./user');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: { origin: '*' },
    pingTimeout: 5000,
    pingInterval: 2000
});

// --- 1. EXPRESS MIDDLEWARE & ROUTING ---
app.use(express.static('public'));
app.use(express.json());

app.use('/api/rooms', roomRoutes);
app.use('/api/users', userRoutes);
app.use('/auth', authRoutes);

// --- 3. SOCKET.IO MIDDLEWARE (JWT) ---
// VARNING: Läs kommentaren nedanför koden om denna ställer till det!
io.use((socket, next) => {
  const token = socket.handshake.auth.token;
  if (!token) return next(new Error('No token'));

  try {
    const user = jwt.verify(token, SECRET);
    socket.user = user; // Spara användaren på socketen
    next();
  } catch {
    next(new Error('Invalid token'));
  }
});


// --- 4. SOCKET.IO CHATTLOGIK ---
let listActiveUsers = {};

io.on('connection', (socket) => {
    console.log('User connected:', socket.user.email, 'Socket ID:', socket.id);

    // Bevarar gamla login-logiken för User-klassen om ni använder den
    socket.on('login', (username) => {
        listActiveUsers[socket.id] = new User(username);
        console.log('User logged in:', username);
    });

    socket.on('join_room', (room) => {
        socket.join(room);
        socket.room = room; // Spara rummet på socketen

        // Sätt rummet på User-objektet om det finns
        if (listActiveUsers[socket.id]) {
            listActiveUsers[socket.id].room = room;
        }
        // if (!room_participants[room]) {
        //     room_participants[room] = [];
        // }
        // const userExists = room_participants[room].some(u => u.id === socket.user.userId);
        // if (!userExists) {
        //     room_participants[room].push({ id: socket.user.userId, email: socket.user.email });
        // }

        // 1. Skicka bekräftelse till den som anslöt
        socket.emit('joined_room', { room: room });

        // 2. Meddela andra i rummet (Använd namnet från listActiveUsers i första hand, annars e-posten från JWT)
        const displayName = listActiveUsers[socket.id] 
          ? listActiveUsers[socket.id].getUsername() 
          : socket.user.email;

        socket.to(room).emit('user_joined', displayName);

        //io.to(room).emit('room_participants', { participants: room_participants[room] || [] });
         

    });

    socket.on('send_message', (message) => {
        const user = listActiveUsers[socket.id];
        if (user) {
            io.to(user.room).emit('receive_message', {
                username: user.username,
                message
            });
        }
    });

    socket.on('disconnect', () => {
        const user = listActiveUsers[socket.id];
        if (user) {
            socket.to(user.room).emit('user_left', user.username);
            delete listActiveUsers[socket.id];
        }
        console.log('User disconnected:', socket.id);
    });
});


// --- 5. GRACEFUL SHUTDOWN ---
process.on('SIGINT', () => {
  io.emit('server_shutdown', 'Servern har stängts ner');
  setTimeout(() => {
    console.log('Servern stängs ner');
    process.exit(0);
  }, 1000);
});


// --- 6. STARTA SERVER ---
server.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});