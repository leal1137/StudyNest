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
    const currentRoom = socket.physicalRoom;

    if (!currentRoom){
        if (oldRoomName === newRoomName) {
            socket.emit('update_persistent_rooms', persistentRooms[location]);
            return;
        }

        newRoom.user_count++;
        socket.physicalRoom = { name: newRoom.name, location };
        io.emit('update_persistent_rooms',persistentRooms[location]);
        return;
    }

    const oldRoomList = persistentRooms[currentRoom.location] || [];
    const oldRoom = oldRoomList.find(r => r.name === currentRoom.name);
    if (currentRoom.location === location && currentRoom.name === newRoom.name){
        if (oldRoom) {
            oldRoom.user_count = Math.max(0, oldRoom.user_count - 1);
        }
        socket.physicalRoom = null;
        io.emit('update_persistent_rooms',oldRoomList);
        return;
    } else {
        newRoom.user_count++;
        if (oldRoom) {
            oldRoom.user_count = Math.max(0, oldRoom.user_count - 1);
        }
        socket.physicalRoom = { name: newRoom.name, location };
        if (currentRoom.location !== location) {
            io.emit('update_persistent_rooms', oldRoomList);
        }
        io.emit('update_persistent_rooms',persistentRooms[location]);
        return;
    }
}

function leavePhysicalRoom(socket, io) {
    const currentRoom = socket.physicalRoom;
    if (!currentRoom) return;

    const roomList = persistentRooms[currentRoom.location] || [];
    const room = roomList.find(r => r.name === currentRoom.name);

    if (room) {
        room.user_count = Math.max(0, room.user_count - 1);
        io.emit('update_persistent_rooms', roomList);
    }

    socket.physicalRoom = null;
}

module.exports = {
  getPersistentRooms,
  updateUserToRoom,
  leavePhysicalRoom
};
