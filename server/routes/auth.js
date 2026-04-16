// routes/auth.js
require('dotenv').config();

const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { createUser, getUserByEmail } = require('./users');

const router = express.Router();

const SECRET = process.env.SECRET;
const allowedDomains = ['kth.se', 'su.se', 'student.uu.se'];

function isStudentEmail(email) {
  const domain = email.split('@')[1];
  return allowedDomains.includes(domain);
}

// Create test user
(async () => {
  try {
    const hashed = await bcrypt.hash("abc", 10);

    await createUser({
      username: "TestUser",
      email: "test@test.su.se",
      password: hashed
    });

    console.log("Test user created");
  } catch (err) {
    if (err.code === '23505') {
      console.log("Test user already exists, skipping...");
    } else {
      console.error("Startup error:", err);
    }
  }
})();

// Signup
router.post('/signup', async (req, res) => {
  const { email, username, password } = req.body;

  if (!isStudentEmail(email)) {
    return res.status(403).json({ error: 'Only students allowed' });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    await createUser({
      username: username,
      email: email,
      password: hashedPassword   // 👈 viktigt namn!
    });

    res.json({ message: 'User created' });

  } catch (err) {
    if (err.code === '23505') {
      return res.status(409).json({ error: 'Username or email already exists' });
    }
    console.error(err);
    res.status(500).json({ error: 'Signup failed' });
  }
});

// Login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await getUserByEmail(email);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const valid = await bcrypt.compare(password, user.password);

    if (!valid) {
      return res.status(401).json({ error: 'Wrong password' });
    }

    const token = jwt.sign(
      { userId: user.id, email: user.email, username: user.username }, // 👈 add username
      SECRET,
      { expiresIn: '2h' }
    );

    res.json({ token });
    console.log(`User logged in: ${user.email} (${user.username})`);

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Login failed' });
  }
});

module.exports = router;