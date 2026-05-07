// --- 0. IMPORTS ---
//loading local secrets from .env
require('dotenv').config(); 

//server imports
const cors = require('cors');
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

//login & user management imports
const jwt = require('jsonwebtoken');
const SECRET = process.env.SECRET;
const User = require('./user');

//route imports ei. Our local API 
const authRoutes = require('./routes/auth');
const roomRoutes = require('./routes/rooms');
const { getPersistentRooms, updateUserToRoom} = require('./routes/physicalRoom');
const virtualRoomRoutes = require('./routes/virtualRooms');
const {
  joinRoom,
  leaveRoom,
  sendMessageToRoom,
  handleTimerAction,
  changeUserStatus,
  handleWhiteboardRequest,
  handleWhiteboardUpdate,
  getRoomCounts
} = require('./routes/virtualRoom');
const { router: userRoutes } = require('./routes/users');
const { send } = require('process');

// --- 1. EXPRESS MIDDLEWARE & ROUTING ---
//making server and Sockets.io
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: { origin: '*' },
    pingTimeout: 5000,
    pingInterval: 2000
});

//server setup
//app.use(express.static('public')); //move to react instead
app.use(express.json());
app.use(cors());
app.use('/api/rooms', roomRoutes);
app.use('/api/virtual-rooms', virtualRoomRoutes);
app.use('/api/users', userRoutes);
app.use('/auth', authRoutes);

const seedRooms = require('./db/seedRooms');
seedRooms();

// --- 2. AUTHENTICATION FOR ENTRY ---
//behövs denna function
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


// --- 3. SOCKET.IO CHATTLOGIC ---
// ei. connection, join_room, send_message, disconnect

//all logged in users, indexed by socket ID
let listActiveUsers = {};


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
    listActiveUsers[socket.id] = new User(socket.user.userId, socket.user.username, socket.user.email, socket.id);
    console.log('Current active users:', Object.values(listActiveUsers).map(u => u.getUsername()));
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
      joinRoom(room, socket, listActiveUsers, io);
    });

    socket.on('leave_room', (room) => {
      leaveRoom(room, socket, listActiveUsers, io);
    });

    socket.on('get_room_counts', () => {
      socket.emit('room_counts_updated', getRoomCounts());
    });

    /**
     * Tar emot ett textmeddelande från klienten och skickar det vidare till 
     * alla andra användare som befinner sig i samma chattrum.
     *
     * @name socketOnSendMessage
     * @function
     * @param {string} message - Textmeddelandet som klienten vill skicka.
     * @param {string} room - Namnet på rummet som klienten vill skicka meddelandet till.
     */
    socket.on('send_message', (message, room) => {
        sendMessageToRoom(room, socket, message, listActiveUsers, io);
    });

    socket.on('timer_action', (data) => {
        handleTimerAction(data.room, data.action, io);
    });

    socket.on('change_status', (data) => {
        changeUserStatus(data.room, socket, data.status, listActiveUsers, io);
    });


    socket.on('get_persistent_rooms', () => {
        getPersistentRooms(socket, io);
    });

    socket.on('join_physical_room', (newRoomName, oldRoomName, location) => {
        updateUserToRoom(newRoomName, oldRoomName, location, socket, io);
    });
        
    socket.on('whiteboard_request', ({ room }, callback) => {
      const board = handleWhiteboardRequest(room, socket);
      if (typeof callback === 'function') {
        callback({ board });
      }
    });

    socket.on('whiteboard_update', ({ room, board }) => {
      handleWhiteboardUpdate(room, socket, board, io);
    });

    /**
     * Hanterar uppstädning när en klient förlorar anslutningen eller stänger webbläsaren. 
     * Raderar användaren från serverns minne och informerar det aktiva rummet om att 
     * personen har lämnat.
     *
     * @name socketOnDisconnecting
     * @function
     */
    socket.on('disconnecting', () => {
      const user = listActiveUsers[socket.id];

      if (!user) return;

      if (socket.room) {
        leaveRoom(socket.room, socket, listActiveUsers, io);
      }

      delete listActiveUsers[socket.id];

      console.log('User disconnecting:', user.getUsername());
      console.log(
        'Current active users:',
        Object.values(listActiveUsers).map(u => u.getUsername())
      );
    });
});


// --- 4. GRACEFUL SHUTDOWN ---
//doesnt work right now
process.on('SIGINT', () => {
  io.emit('server_shutdown', 'Servern har stängts ner');
  io.disconnectSockets();
  server.close();
  setTimeout(() => {
    console.log('Servern stängs ner');
    process.exit(0);
  }, 1000);
});


// --- 5. START SERVER ---
// Only start listening if we are NOT running tests
if (process.env.NODE_ENV !== 'test') {
  server.listen(3000, () => {
    console.log('Server running on http://localhost:3000');
  });
}
// --- 6. EXPORTS FOR TESTING ---
// Export the instances so our test files can use them
module.exports = { app, server, io };
