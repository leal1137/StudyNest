let persistentRooms = {};
let onGoingFetch = false
async function getPersistentRooms(location,socket, io) {
    if (Object.keys(persistentRooms).length === 0 && !onGoingFetch){
        console.log('Fetching persistent rooms from database...');
        onGoingFetch = true;
        try {
            const res = await fetch('http://localhost:3000/api/rooms');
            if (!res.ok) throw new Error('Failed to fetch rooms');
            const data = await res.json();
            const roomslist = Object.values(data);
            for (const aRoom of roomslist){
                let local = aRoom.room_location
                if (!persistentRooms[local]){
                    persistentRooms[local] = [];
                }
                persistentRooms[local].push(aRoom);
            }
        } catch (err) {
        socket.emit('error', { message: 'Failed to fetch room'+ err.message, details: err.message });
        }
        onGoingFetch = false;
    }
        io.emit('update_persistent_rooms', persistentRooms[location] || []);
}

function updateUserToRoom(newRoomName, oldRoomName, location, socket, io) {
    if (!persistentRooms[location]) {
        socket.emit('update_persistent_rooms', []);
        return;
    }

    let newRoom = persistentRooms[location].find(r => r.name === newRoomName);
    if (!newRoom)return;

    if (!oldRoomName){
        newRoom.user_count++;
        io.emit('update_persistent_rooms',persistentRooms[location]);
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
