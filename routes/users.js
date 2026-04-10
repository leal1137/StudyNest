const express = require('express');
const router = express.Router();
const pool = require('../db/pool');

async function createUser({ username, email, password }) {
    const result = await pool.query(
        'INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING *',
        [username, email, password]
    );
    return result.rows[0];
}

// POST /api/users — register a new user
router.post('/', async (req, res) => {
    const { username, email, password } = req.body;

    try {
        const user = await createUser({ username, email, password });
        res.status(201).json(user);
    } catch (err) {
        if (err.code === '23505') {
            return res.status(409).json({ error: 'Username or email already exists' });
        }
        console.error(err);
        res.status(500).json({ error: 'Failed to create user' });
    }
});

// GET /api/users/:id
router.get('/:id', async (req, res) => {
    try {
        const result = await pool.query(
            'SELECT * FROM users WHERE id = $1',
            [req.params.id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to fetch user' });
    }
});

module.exports = {
    router,
    createUser
};