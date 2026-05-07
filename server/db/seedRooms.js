// server/db/seedRooms.js
const pool = require('./pool');

const PERSISTENT_ROOMS = [
  { name: 'Silent study room', max_capacity: 30, is_silent: true, user_count: 0, room_location: "Ekonomikum"},
  { name: 'Maths ecom',        max_capacity: 40, is_silent: true, user_count: 0, room_location: "Ekonomikum"},
  { name: 'Chattier room',  max_capacity: 15, is_silent: false, user_count: 0, room_location: "Ekonomikum"},
  { name: 'The silent study', max_capacity: 30, is_silent: true, user_count: 0, room_location: "Ångström"},
  { name: 'Maths phy',        max_capacity: 40, is_silent: true, user_count: 0, room_location: "Ångström"},
  { name: 'Chattiest room',  max_capacity: 15, is_silent: false, user_count: 0, room_location: "Ångström"},
  { name: 'Silent study', max_capacity: 30, is_silent: true, user_count: 0, room_location: "Carolina Rediviva"},
  { name: 'Maths',        max_capacity: 40, is_silent: true, user_count: 0, room_location: "Carolina Rediviva"},
  { name: 'Chatty room',  max_capacity: 15, is_silent: false, user_count: 0, room_location: "Carolina Rediviva"}
];

async function seedRooms() {
  for (const room of PERSISTENT_ROOMS) {
    try {
      await pool.query(
        `INSERT INTO rooms (name, max_capacity, is_silent,user_count,room_location)
         VALUES ($1, $2, $3, $4, $5)
         ON CONFLICT (name) DO NOTHING`,
        [room.name, room.max_capacity, room.is_silent, room.user_count,room.room_location]
      );
    } catch (err) {
      console.error(`Failed to seed "${room.name}":`, err.message);
    }
  }
  console.log('Persistent rooms ready');
}

module.exports = seedRooms;