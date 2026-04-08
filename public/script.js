const token = localStorage.getItem('token');

if (!token) {
    window.location.href = '/login.html';
}

const socket = io({
    auth: {
      token: localStorage.getItem('token')
    }
  });

const bcrypt = require('bcrypt');

const allowedDomains = ['kth.se', 'su.se', 'student.uu.se'];

function isStudentEmail(email) {
  const domain = email.split('@')[1];
  return allowedDomains.includes(domain);
}

function logout() {
    localStorage.removeItem('token');
    window.location.href = '/login.html';
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


function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader) return res.sendStatus(401);

  const token = authHeader.split(' ')[1];

  try {
    const user = jwt.verify(token, SECRET);
    req.user = user;
    next();
  } catch {
    res.sendStatus(403);
  }
}

app.get('/rooms', authMiddleware, (req, res) => {
  res.json({ rooms: [] });
});

function joinRoom() {
    const username = document.getElementById('username').value;
    const room = document.getElementById('room').value;
    socket.emit('join_room', { username, room });
}

function sendMessage() {
    const message = document.getElementById('message').value;
    socket.emit('send_message', message);
}

socket.on('receive_message', (data) => {
    const chat = document.getElementById('chat');
    chat.innerHTML += `<p><b>${data.username}:</b> ${data.message}</p>`;
});

socket.on('user_joined', (username) => {
    const chat = document.getElementById('chat');
    chat.innerHTML += `<p><i>${username} joined</i></p>`;
});

socket.on('joined_room', (data) => {
    const chat = document.getElementById('chat');
    chat.innerHTML += `<p><b>You joined room ${data.room}</b></p>`;
});

socket.on('user_left', (username) => {
    const chat = document.getElementById('chat');
    chat.innerHTML += `<p><i>${username} left</i></p>`;
});

//Nytt
const warningBanner = document.getElementById('connection-warning');
let isPlanned = false; // Håller koll på om det är Ctrl+C eller ett fel

socket.on('server_shutdown', (meddelande) => {
    isPlanned = true;
    
    document.body.style.margin = '0';
    document.body.innerHTML = `
        <div style="display: flex; flex-direction: column; justify-content: center; align-items: center; height: 100vh; text-align: center; font-family: sans-serif; background-color: #f4f4f4;">
            <div style="font-size: 70px; margin-bottom: 20px;">😥</div>
            <h1 style="color: #333;">${meddelande}</h1>
        </div>
    `;
});

socket.on('disconnect', (reason) => {
    if (!isPlanned) {
        warningBanner.style.display = 'block';
    }
});

socket.on('connect', () => {
    warningBanner.style.display = 'none';
    isPlanned = false;
});