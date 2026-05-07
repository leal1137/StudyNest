const {getRoomsFromDB} = require('./rooms');

let persistentRooms = {};

async function getPersistentRooms(location ,socket, io) {
    console.log('Fetching persistent rooms from database...');
    console.log(location);
    if (!persistentRooms[location]){
        //persistentRooms
        try {
        const res = await fetch('http://localhost:3000/api/rooms');
        if (!res.ok) throw new Error('Failed to fetch rooms');
        const data = await res.json();
        persistentRooms[location] = data
        } catch (err) {
        socket.emit('error', { message: 'Failed to fetch room'+ err.message, details: err.message });
        }
    }
        io.emit('update_persistent_rooms', persistentRooms[location]);
}

function updateUserToRoom(newRoomName, oldRoomName, location, socket, io) {
    let newRoom = persistentRooms[location];
    console.log(location);
    newRoom = newRoom.find(r => r.name === newRoomName);
    if (!newRoom)return;

    if (!oldRoomName){
        newRoom.user_count++;
        io.emit('update_persistent_rooms',persistentRooms);
        return;
    }
    const oldRoom = persistentRooms[location].find(r => r.name === oldRoomName);
    if (oldRoom.name === newRoom.name){
        oldRoom.user_count--;
        io.emit('update_persistent_rooms',persistentRooms[location]);
        return;
    } else {
        newRoom.user_count++;
        oldRoom.user_count--;
        io.emit('update_persistent_rooms',persistentRooms[location]);
        return;
    }
}

module.exports = {
  getPersistentRooms,
  updateUserToRoom
};
