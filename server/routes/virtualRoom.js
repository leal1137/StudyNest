require('socket.io');
//set of all users in rooms
let List_of_rooms = {};


/**
 * Hanterar logiken när en användare går med i ett rum.
 * @param {string} room 
 * @param {Socket} socket 
 * @param {list<User>} listActiveUsers 
 * @param {Server} io 
 * @returns {void}
 * @description Denna funktion hanterar logiken när en användare går med i ett rum. 
 */
function joinRoom(room, socket, listActiveUsers, io) {
    if (socket.rooms.has(room)) {
        console.log(`User ${listActiveUsers[socket.id]?.getUsername()} is already in room: ${room}`);
        io.to(room).emit('list_participants_in_room', { participants_List: List_of_rooms[room] });
        socket.emit('user_already_in_room', room);
        return;
    }
    socket.join(room);
    socket.room = room;

    const user = listActiveUsers[socket.id];
    if (!user) return;
    const displayName = user.getUsername();
    
    if (!List_of_rooms[room]) {
        List_of_rooms[room] = [];
    }
    const userExists = List_of_rooms[room].some(user => user.getUsername() === displayName);
    if (!userExists) {
        List_of_rooms[room].push(user);
    }
    // bekräfta att att användaren har joinat rummet
    console.log(`User ${displayName} joined room: ${room}`);

    io.to(room).emit('user_joined_room', displayName);
    io.to(room).emit('list_participants_in_room', { participants_List: List_of_rooms[room] });

} 

function leaveRoom(room, socket, listActiveUsers, io) {
    const user = listActiveUsers[socket.id];
    if (user && List_of_rooms[room]) {
        List_of_rooms[room] = List_of_rooms[room].filter(u => u.getUsername() !== user.getUsername());
        const displayName = user.getUsername();
        console.log(`User ${displayName} left room: ${room}`);
        io.to(room).emit('user_left_room', { participants_List: List_of_rooms[room], name: displayName });
    }
    socket.leave(room);
}

function sendMessageToRoom(room, socket, message, listActiveUsers, io) {
    const user = listActiveUsers[socket.id];
    if (user) {
        io.to(room).emit('receive_message', {
            username: user.username,
            message
        });
    }
}

module.exports = { joinRoom, leaveRoom, sendMessageToRoom };

