require('socket.io');
//set of all users in rooms
let room_participants = {};

function joinRoom(room, socket, listActiveUsers, io) {
    socket.join(room);
    socket.room = room;

    const user = listActiveUsers[socket.id];
    if (!user) return;
    const displayName = user.getUsername();
    
    if (!room_participants[room]) {
        room_participants[room] = [];
    }
    const userExists = room_participants[room].some(user => user.socketId === socket.id);
    if (!userExists) {
        room_participants[room].push(listActiveUsers[socket.id]);
    }
    // bekräfta att att användaren har joinat rummet
    console.log(`User ${displayName} joined room: ${room}`);

    socket.emit('user_joined_room', displayName);
    //io.to(room).emit('user_joined_room', displayName);
    //io.to(room).emit('list_room_participants', { participants: room_participants[room] });
} 
module.exports = { joinRoom };