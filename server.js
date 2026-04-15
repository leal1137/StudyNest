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

/**
 * Fungerar som en dörrvakt för chatten. Den kollar användarens JWT-token 
 * för att se till att bara inloggade personer får ansluta. Om allt 
 * stämmer sparas användarens uppgifter direkt på anslutningen (socketen).
 * @name authenticateSocket
 * @function
 * @param {Object} socket - Klientens anslutningsobjekt.
 * @param {Function} next - Callback-funktion för att godkänna (next()) eller neka (next(Error)) anslutningen.
 */
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
let room_participants = {};


/**
 * Hanterar en ny anslutning till realtidsservern. 
 * Lyssnar efter klientens händelser och sätter upp logiken för inloggning, 
 * chattrum och meddelanden för just denna specifika användare.
 *
 * @name onSocketConnection
 * @function
 * @param {Object} socket - Klientens unika anslutningsobjekt.
 */
io.on('connection', (socket) => {
    console.log('User connected:', socket.user.email, 'Socket ID:', socket.id);

    listActiveUsers[socket.id] = new User(socket.user.username, socket.user.email, socket.id);
    /**
     * Registrerar användaren manuellt och skapar ett nytt User-objekt på servern.
     *
     * @name socketOnLogin
     * @function
     * @param {string} username - Namnet som användaren väljer vid inloggning.
     */
    socket.on('login', (username) => {
        listActiveUsers[socket.id] = new User(username);
        console.log('User logged in:', username);
    });


    /**
     * Placerar klienten i ett specifikt chattrum. Funktionen uppdaterar serverns 
     * interna listor över vilka som är i rummet och meddelar sedan både den 
     * anslutande klienten och de befintliga deltagarna om uppdateringen.
     *
     * @name socketOnJoinRoom
     * @function
     * @param {string} room - Namnet på rummet som klienten vill ansluta till.
     */
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


    /**
     * Tar emot ett textmeddelande från klienten och skickar det vidare till 
     * alla andra användare som befinner sig i samma chattrum.
     *
     * @name socketOnSendMessage
     * @function
     * @param {string} message - Textmeddelandet som klienten vill skicka.
     */
    socket.on('send_message', (message) => {
        const user = listActiveUsers[socket.id];
        if (user) {
            io.to(user.room).emit('receive_message', {
                username: user.username,
                message
            });
        }
    });


    /**
     * Hanterar uppstädning när en klient förlorar anslutningen eller stänger webbläsaren. 
     * Raderar användaren från serverns minne och informerar det aktiva rummet om att 
     * personen har lämnat.
     *
     * @name socketOnDisconnect
     * @function
     */
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
  io.disconnectSockets();
  server.close();
  setTimeout(() => {
    console.log('Servern stängs ner');
    process.exit(0);
  }, 1000);
});


// --- 6. STARTA SERVER ---
// Only start listening if we are NOT running tests
if (process.env.NODE_ENV !== 'test') {
  server.listen(3000, () => {
    console.log('Server running on http://localhost:3000');
  });
}

// Export the instances so our test files can use them
module.exports = { app, server, io };