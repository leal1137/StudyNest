const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
require('dotenv').config();

const pool = require('./db/pool');
const roomRoutes = require('./routes/rooms');
const userRoutes = require('./routes/users');

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
  cors: { origin: '*' },
  pingTimeout: 5000,
  pingInterval: 2000
});

app.use(express.json());
app.use(express.static('public'));
app.use(express.json());
app.use('/api/rooms', roomRoutes);
app.use('/api/users', userRoutes);

const users = []; // later → PostgreSQL

const bcrypt = require('bcrypt');
(async () => {
  const hashed = await bcrypt.hash("abc", 10);

  users.push({
    id: 0,
    email: "test@test.su.se",
    password: hashed
  });
})();

const allowedDomains = ['kth.se', 'su.se', 'student.uu.se'];

function isStudentEmail(email) {
  const domain = email.split('@')[1];
  return allowedDomains.includes(domain);
}

app.post('/auth/signup', async (req, res) => {
  const { email, password } = req.body;

  if (!isStudentEmail(email)) {
    return res.status(403).json({ error: 'Only students allowed' });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = {
    id: users.length + 1,
    email,
    password: hashedPassword
  };

  users.push(user);

  res.json({ message: 'User created' });
});

const jwt = require('jsonwebtoken');

const SECRET = 'supersecretkey';

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

io.use((socket, next) => {
  const token = socket.handshake.auth.token;

  if (!token) return next(new Error('No token'));

  try {
    const user = jwt.verify(token, SECRET);
    socket.user = user;
    next();
  } catch {
    next(new Error('Invalid token'));
  }
});



io.on('connection', (socket) => {
  console.log('User connected:', socket.user.email);

  socket.on('join_room', (room) => {
    socket.join(room);

    socket.emit('joined_room', room);
    socket.to(room).emit('user_joined', socket.user.email);
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