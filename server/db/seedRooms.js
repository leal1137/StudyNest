// server/db/seedRooms.js
const pool = require('./pool');

const PERSISTENT_ROOMS = [
  { name: 'Silent study room', user_count: 0, room_location: "Ekonomikum"},
  { name: 'Maths ecom',        user_count: 0, room_location: "Ekonomikum"},
  { name: 'Chattier room',     user_count: 0, room_location: "Ekonomikum"},
  { name: 'The silent study',  user_count: 0, room_location: "Ångström"},
  { name: 'Maths phy',         user_count: 0, room_location: "Ångström"},
  { name: 'Chattiest room',    user_count: 0, room_location: "Ångström"},
  { name: 'Silent study',      user_count: 0, room_location: "Carolina Rediviva"},
  { name: 'Maths',             user_count: 0, room_location: "Carolina Rediviva"},
  { name: 'Chatty room',       user_count: 0, room_location: "Carolina Rediviva"}
];

async function seedRooms() {
  for (const room of PERSISTENT_ROOMS) {
    try {
      await pool.query(
        `INSERT INTO rooms (name,user_count, room_location)
         VALUES ($1, $2, $3)
         ON CONFLICT (name) DO NOTHING`,
        [room.name, room.user_count,room.room_location]
      );
    } catch (err) {
      console.error(`Failed to seed "${room.name}":`, err.message);
    }
  }
  console.log('Persistent rooms ready');
}

module.exports = seedRooms;
