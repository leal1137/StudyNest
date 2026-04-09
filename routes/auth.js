// routes/auth.js
const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const router = express.Router();

const users = []; // later → move to DB
const SECRET = process.env.SECRET;
const allowedDomains = ['kth.se', 'su.se', 'student.uu.se'];

function isStudentEmail(email) {
  const domain = email.split('@')[1];
  return allowedDomains.includes(domain);
}

// Create test user
(async () => {
  const hashed = await bcrypt.hash("abc", 10);
  users.push({ id: 0, email: "test@test.su.se", username:"TestUser", password: hashed });
})();

// Signup
router.post('/signup', async (req, res) => {
  const { email, username, password } = req.body;

  if (!isStudentEmail(email)) {
    return res.status(403).json({ error: 'Only students allowed' });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = {
    id: users.length + 1,
    email,
    username,
    password: hashedPassword
  };

  users.push(user);

  res.json({ message: 'User created' });
});

// Login
router.post('/login', async (req, res) => {
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

module.exports = router;