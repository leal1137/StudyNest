const pool = require('../db/pool');

function roomHandler(io) {
    io.on('connection', (socket) => {
        console.log('User connected:', socket.id);

        // Join a study room
        socket.on('join-room', async ({ userId, roomId }) => {
            try {
                // Add participant to the database
                await pool.query(
                    'INSERT INTO room_participants (user_id, room_id) VALUES ($1, $2) ON CONFLICT DO NOTHING',
                    [userId, roomId]
                );

                socket.join(roomId);
                socket.userId = userId;
                socket.roomId = roomId;

                // Get current participants
                const participants = await pool.query(
                    `SELECT u.id, u.username FROM room_participants rp
                     JOIN users u ON rp.user_id = u.id
                     WHERE rp.room_id = $1`,
                    [roomId]
                );

                // Notify everyone in the room
                io.to(roomId).emit('room-update', {
                    participants: participants.rows,
                });

                console.log(`User ${userId} joined room ${roomId}`);
            } catch (err) {
                console.error('Error joining room:', err);
                socket.emit('error', { message: 'Failed to join room' });
            }
        });

        // Leave a study room
        socket.on('leave-room', async () => {
            await removeFromRoom(socket, io);
        });

        // Handle disconnect
        socket.on('disconnect', async () => {
            await removeFromRoom(socket, io);
            console.log('User disconnected:', socket.id);
        });
    });
}

async function removeFromRoom(socket, io) {
    if (!socket.userId || !socket.roomId) return;

    try {
        await pool.query(
            'DELETE FROM room_participants WHERE user_id = $1 AND room_id = $2',
            [socket.userId, socket.roomId]
        );

        const participants = await pool.query(
            `SELECT u.id, u.username FROM room_participants rp
             JOIN users u ON rp.user_id = u.id
             WHERE rp.room_id = $1`,
            [socket.roomId]
        );

        io.to(socket.roomId).emit('room-update', {
            participants: participants.rows,
        });

        socket.leave(socket.roomId);
    } catch (err) {
        console.error('Error leaving room:', err);
    }
}

module.exports = roomHandler;