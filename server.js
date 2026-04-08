const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const pool = require('./db/pool');
const roomRoutes = require('./routes/rooms');
const userRoutes = require('./routes/users');
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


// --- 2. REST API FÖR AUTENTISERING ---
const users = []; // later → PostgreSQL
const SECRET = 'supersecretkey';
const allowedDomains = ['kth.se', 'su.se', 'student.uu.se'];

function isStudentEmail(email) {
  const domain = email.split('@')[1];
  return allowedDomains.includes(domain);
}

// Skapa en testanvändare vid uppstart
(async () => {
  const hashed = await bcrypt.hash("abc", 10);
  users.push({ id: 0, email: "test@test.su.se", password: hashed });
})();

app.post('/auth/signup', async (req, res) => {
  const { email, password } = req.body;
  if (!isStudentEmail(email)) {
    return res.status(403).json({ error: 'Only students allowed' });
  }
  const hashedPassword = await bcrypt.hash(password, 10);
  const user = { id: users.length + 1, email, password: hashedPassword };
  users.push(user);
  res.json({ message: 'User created' });
});

app.post('/auth/login', async (req, res) => {
  const { email, password } = req.body;
  const user = users.find(u => u.email === email);
  if (!user) return res.status(404).json({ error: 'User not found' });
  const valid = await bcrypt.compare(password, user.password);
  if (!valid) return res.status(401).json({ error: 'Wrong password' });
  const token = jwt.sign(
    { userId: user.id, email: user.email }, 
    SECRET, 
    { expiresIn: '2h' }
  );
  res.json({ token });
});


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
let listUsers = {};

io.on('connection', (socket) => {
    console.log('User connected:', socket.user.email, 'Socket ID:', socket.id);

    // Bevarar gamla login-logiken för User-klassen om ni använder den
    socket.on('login', (username) => {
        listUsers[socket.id] = new User(username);
        console.log('User logged in:', username);
    });

    socket.on('join_room', (room) => {
        socket.join(room);
        
        // Sätt rummet på User-objektet om det finns
        if (listUsers[socket.id]) {
            listUsers[socket.id].room = room;
        }

        // 1. Skicka bekräftelse till den som anslöt
        socket.emit('joined_room', { room: room });

        // 2. Meddela andra i rummet (Använd namnet från listUsers i första hand, annars e-posten från JWT)
        const displayName = listUsers[socket.id] ? listUsers[socket.id].getUsername() : socket.user.email;
        socket.to(room).emit('user_joined', displayName);
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