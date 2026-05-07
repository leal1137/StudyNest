const express = require('express');
const router = express.Router();
const pool = require('../db/pool');

router.get('/', async (req, res) => {
    try {
        const result = await pool.query(
            'SELECT id, name, created_by, created_at FROM rooms ORDER BY created_at DESC'
        );
        res.json(result.rows);
    } catch (err) {
        console.error('Failed to fetch physical rooms:', err.message);
        res.status(500).json({ error: 'Failed to fetch rooms' });
    }
});

router.post('/', async (req, res) => {
    const { name, created_by } = req.body;

    if (!name) {
        return res.status(400).json({ error: 'Room name is required' });
    }

    try {
        const result = await pool.query(
            `INSERT INTO rooms (name,  created_by, user_count,room_location)
             VALUES ($1, $2, $3 $4)
             RETURNING *`,
            [name, created_by || null, 0, room_location || '']
            `INSERT INTO rooms (name, created_by)
             VALUES ($1, $2)
             RETURNING id, name, created_by, created_at`,
            [name, created_by || null]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error('Failed to create physical room:', err.message);
        res.status(500).json({ error: 'Failed to create room' });
    }
});

module.exports = router;
