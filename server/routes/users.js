//users.js
const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const pool = require('../db/pool');

// Creates a new user in the database
// Returns the user (without password) or throws an error
const jwt = require('jsonwebtoken');

const SECRET = process.env.SECRET;
const validAvatars = new Set(Array.from({ length: 23 }, (_, index) => `${index}.svg`));

function normalizeAvatar(avatar) {
    return validAvatars.has(avatar) ? avatar : '0.svg';
}

function authenticateUser(req, res, next) {
    const authHeader = req.headers.authorization || '';
    const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;

    if (!token) {
        return res.status(401).json({ error: 'Missing token' });
    }

    try {
        req.user = jwt.verify(token, SECRET);
        next();
    } catch {
        res.status(401).json({ error: 'Invalid token' });
    }
}

function signUserToken(user) {
    return jwt.sign(
        { userId: user.id, email: user.email, username: user.username, avatar: user.avatar || '0.svg' },
        SECRET,
        { expiresIn: '2h' }
    );
}

async function createUser({ username, email, password, avatar = '0.svg' }) {
    // Check if email already exists
    const existing = await pool.query('SELECT id FROM users WHERE email = $1', [email]);
    if (existing.rows.length > 0) {
        const error = new Error('Email already exists');
        error.code = '23505';
        throw error;
    }

    const result = await pool.query(
        'INSERT INTO users (username, email, password, avatar) VALUES ($1, $2, $3, $4) RETURNING id, username, email, avatar, created_at',
        [username, email, password, normalizeAvatar(avatar)]
    );
    return result.rows[0];
}

// POST /api/users — register a new user
router.post('/', async (req, res) => {
    const { username, email, password, avatar } = req.body;

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await createUser({ username, email, password: hashedPassword, avatar });
        res.status(201).json(user);
    } catch (err) {
        if (err.code === '23505') {
            return res.status(409).json({ error: 'Username or email already exists' });
        }
        console.error(err);
        res.status(500).json({ error: 'Failed to create user' });
    }
});

router.patch('/avatar', authenticateUser, async (req, res) => {
    const avatar = normalizeAvatar(req.body.avatar);

    try {
        const result = await pool.query(
            'UPDATE users SET avatar = $1 WHERE id = $2 RETURNING id, username, email, avatar',
            [avatar, req.user.userId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.json({ avatar: result.rows[0].avatar, token: signUserToken(result.rows[0]) });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to update avatar' });
    }
});

// GET /api/users/:email — get a user by email
// If password is provided, verify it and return user without password
// If no password is provided, return user with password (so auth can verify it)
router.get('/:email', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM users WHERE email = $1', [req.params.email]);

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }

        const user = result.rows[0];

        // If password was provided in query, verify it
        if (req.query.password) {
            const valid = await bcrypt.compare(req.query.password, user.password);
            if (!valid) {
                return res.status(401).json({ error: 'Wrong password' });
            }
            // Password verified — return user WITHOUT password
            const { password, ...safeUser } = user;
            return res.json(safeUser);
        }

        // No password provided — return everything including password hash
        // (needed by auth.js to verify login)
        res.json(user);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to fetch user' });
    }
});

async function getUserByEmail(email) {
    const result = await pool.query(
        'SELECT * FROM users WHERE email = $1', [email]);

    return result.rows[0]; // undefined om ingen finns
}

module.exports = {
    router,
    createUser,
    getUserByEmail,
    normalizeAvatar,
    signUserToken
};
