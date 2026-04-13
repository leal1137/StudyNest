const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const pool = require('../db/pool');

// Creates a new user in the database
// Returns the user (without password) or throws an error
async function createUser({ username, email, hashedPassword }) {
    // Check if email already exists
    const existing = await pool.query('SELECT id FROM users WHERE email = $1', [email]);
    if (existing.rows.length > 0) {
        const error = new Error('Email already exists');
        error.code = '23505';
        throw error;
    }

    const result = await pool.query(
        'INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING id, username, email, created_at',
        [username, email, hashedPassword]
    );
    return result.rows[0];
}

// POST /api/users — register a new user
router.post('/', async (req, res) => {
    const { username, email, password } = req.body;

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await createUser({ username, email, hashedPassword });
        res.status(201).json(user);
    } catch (err) {
        if (err.code === '23505') {
            return res.status(409).json({ error: 'Username or email already exists' });
        }
        console.error(err);
        res.status(500).json({ error: 'Failed to create user' });
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

module.exports = {
    router,
    createUser
};