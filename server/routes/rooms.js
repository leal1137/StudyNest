const express = require('express');
const router = express.Router();
const pool = require('../db/pool');

// GET /api/rooms — list all rooms
router.get('/', async (req, res) => {
    try {
        const result = await pool.query(
            'SELECT * FROM rooms ORDER BY created_at DESC'
        );
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to fetch rooms' });
    }
});

// POST /api/rooms — create a new room
router.post('/', async (req, res) => {
    const { name, max_capacity, is_silent, created_by } = req.body;
    try {
        const result = await pool.query(
            `INSERT INTO rooms (name, max_capacity, is_silent, created_by)
             VALUES ($1, $2, $3, $4)
             RETURNING *`,
            [name, max_capacity || 10, is_silent || false, created_by || null]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        if (err.code === '23505') {
            return res.status(409).json({ error: 'A room with that name already exists' });
        }
        console.error(err);
        res.status(500).json({ error: 'Failed to create room' });
    }
});

// GET /api/rooms/:id — get a single room
router.get('/:id', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM rooms WHERE id = $1', [req.params.id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Room not found' });
        }
        res.json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to fetch room' });
    }
});

// DELETE /api/rooms/:id — delete a room
router.delete('/:id', async (req, res) => {
    try {
        const result = await pool.query(
            'DELETE FROM rooms WHERE id = $1 RETURNING *',
            [req.params.id]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Room not found' });
        }
        res.json({ message: 'Room deleted' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to delete room' });
    }
});

module.exports = router;