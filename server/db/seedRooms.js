// server/db/seedRooms.js
const pool = require('./pool');

const PERSISTENT_ROOMS = [
  { name: 'Silent study' },
  { name: 'Maths' },
  { name: 'Chatty room' },
];

async function seedRooms() {
  for (const room of PERSISTENT_ROOMS) {
    try {
      await pool.query(
        `INSERT INTO rooms (name)
         VALUES ($1)
         ON CONFLICT (name) DO NOTHING`,
        [room.name]
      );
    } catch (err) {
      console.error(`Failed to seed "${room.name}":`, err.message);
    }
  }
  console.log('Persistent rooms ready');
}

module.exports = seedRooms;
