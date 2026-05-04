// server/db/seedRooms.js
const pool = require('./pool');

const PERSISTENT_ROOMS = [
  { name: 'Silent study', max_capacity: 30, is_silent: true  },
  { name: 'Maths',       max_capacity: 40, is_silent: true  },
  { name: 'Chatty room',            max_capacity: 15, is_silent: false },
];

async function seedRooms() {
  for (const room of PERSISTENT_ROOMS) {
    try {
      await pool.query(
        `INSERT INTO rooms (name, max_capacity, is_silent)
         VALUES ($1, $2, $3)
         ON CONFLICT (name) DO NOTHING`,
        [room.name, room.max_capacity, room.is_silent]
      );
    } catch (err) {
      console.error(`Failed to seed "${room.name}":`, err.message);
    }
  }
  console.log('Persistent rooms ready');
}

module.exports = seedRooms;