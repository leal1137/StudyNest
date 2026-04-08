const express = require('express');
const router = express.Router();
const pool = require('../db/pool');

// GET /api/rooms — list all rooms with participant counts
router.get('/', async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT r.*, COUNT(rp.id) AS participant_count
            FROM rooms r
            LEFT JOIN room_participants rp ON r.id = rp.room_id
            GROUP BY r.id
            ORDER BY r.created_at DESC
        `);
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
            [name, max_capacity || 10, is_silent || false, created_by]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to create room' });
    }
});

// GET /api/rooms/:id — get a single room with its participants
router.get('/:id', async (req, res) => {
    try {
        const room = await pool.query('SELECT * FROM rooms WHERE id = $1', [req.params.id]);
        if (room.rows.length === 0) {
            return res.status(404).json({ error: 'Room not found' });
        }

        const participants = await pool.query(
            `SELECT u.id, u.username, rp.joined_at
             FROM room_participants rp
             JOIN users u ON rp.user_id = u.id
             WHERE rp.room_id = $1`,
            [req.params.id]
        );

        res.json({ ...room.rows[0], participants: participants.rows });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to fetch room' });
    }
});

// DELETE /api/rooms/:id — delete a room
router.delete('/:id', async (req, res) => {
    try {
        await pool.query('DELETE FROM rooms WHERE id = $1', [req.params.id]);
        res.json({ message: 'Room deleted' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to delete room' });
    }
});

module.exports = router;