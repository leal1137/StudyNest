const {getRoomsFromDB} = require('./rooms');

let persistentRooms = [];

async function getPersistentRooms(socket, io) {
    console.log('Fetching persistent rooms from database...');
    if (persistentRooms.length === 0){
        try {
            const res = await fetch('http://localhost:3000/api/rooms');
            if (!res.ok) throw new Error('Failed to fetch rooms');
            const data = await res.json();
            // for (const aRoom of data){
            //     let local = aRoom.room_location
            //     if (!persistentRooms[local]){
            //         persistentRooms[local] = [];
            //     }
            //     persistentRooms[local].push(aRoom);
            // }
            persistentRooms = data;
        } catch (err) {
        socket.emit('error', { message: 'Failed to fetch room'+ err.message, details: err.message });
        }
    }
        io.emit('update_persistent_rooms', persistentRooms);
}

function updateUserToRoom(newRoomName, oldRoomName, location, socket, io) {
    let newRoom = persistentRooms.find(r => r.name === newRoomName);
    if (!newRoom)return;

    if (!oldRoomName){
        newRoom.user_count++;
        io.emit('update_persistent_rooms',persistentRooms);
        return;
    }
    const oldRoom = persistentRooms.find(r => r.name === oldRoomName);
    if (oldRoom.name === newRoom.name){
        oldRoom.user_count--;
        io.emit('update_persistent_rooms',persistentRooms);
        return;
    } else {
        newRoom.user_count++;
        oldRoom.user_count--;
        io.emit('update_persistent_rooms',persistentRooms);
        return;
    }
}

module.exports = {
  getPersistentRooms,
  updateUserToRoom
};
