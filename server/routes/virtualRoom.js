require('socket.io');
//set of all users in rooms
let List_of_rooms = {};
let RoomTimers = {};
let RoomWhiteboards = {};


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

    if (RoomTimers[room]) {
        socket.emit('timer_update', { 
            timeLeft: RoomTimers[room].timeLeft, 
            isActive: RoomTimers[room].isActive 
        });
    }

    sendWhiteboardToUser(room, socket);
} 

function leaveRoom(room, socket, listActiveUsers, io) {
    const user = listActiveUsers[socket.id];

    if (!user || !List_of_rooms[room]) {
        socket.leave(room);
        socket.room = null;
        return;
    }

    const displayName = user.getUsername();

    List_of_rooms[room] = List_of_rooms[room].filter(
        u => u.getUsername() !== displayName
    );

    console.log(`User ${displayName} left room: ${room}`);

    io.to(room).emit('user_left_room', {
        participants_List: List_of_rooms[room],
        name: displayName
    });

    socket.leave(room);
    socket.room = null;
    user.room = null;

    if (List_of_rooms[room].length === 0) {
        delete List_of_rooms[room];

        if (RoomTimers[room]) {
            clearInterval(RoomTimers[room].intervalId);
            delete RoomTimers[room];
        }

    }
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

function handleTimerAction(room, action, io) {
    // Ändrar standardtiden till 25 minuter (1500 sek) om rummet är helt nytt
    if (!RoomTimers[room]) {
        RoomTimers[room] = { timeLeft: 25 * 60, isActive: false, intervalId: null };
    }
    
    let timer = RoomTimers[room];

    if (action === 'start' && !timer.isActive) {
        timer.isActive = true;
        io.to(room).emit('timer_update', { timeLeft: timer.timeLeft, isActive: true });
        
        timer.intervalId = setInterval(() => {
            if (timer.timeLeft > 0) {
                timer.timeLeft -= 1;
                io.to(room).emit('timer_update', { timeLeft: timer.timeLeft, isActive: true });
            } else {
                timer.isActive = false;
                clearInterval(timer.intervalId);
                io.to(room).emit('timer_update', { timeLeft: 0, isActive: false });
                io.to(room).emit('timer_ended');
            }
        }, 1000);
    } else if (action === 'pause' && timer.isActive) {
        timer.isActive = false;
        clearInterval(timer.intervalId);
        io.to(room).emit('timer_update', { timeLeft: timer.timeLeft, isActive: false });
        
    // NYTT: Sätt timern på 25 minuter och pausa
    } else if (action === 'pomodoro_study') {
        timer.isActive = false;
        clearInterval(timer.intervalId);
        timer.timeLeft = 25 * 60;
        io.to(room).emit('timer_update', { timeLeft: timer.timeLeft, isActive: false });
        
    // NYTT: Sätt timern på 5 minuter och pausa
    } else if (action === 'pomodoro_break') {
        timer.isActive = false;
        clearInterval(timer.intervalId);
        timer.timeLeft = 5 * 60;
        io.to(room).emit('timer_update', { timeLeft: timer.timeLeft, isActive: false });
    }
}

function changeUserStatus(room, socket, newStatus, listActiveUsers, io) {
    const user = listActiveUsers[socket.id];
    if (user) {
        user.status = newStatus;
        
        if (List_of_rooms[room]) {
            io.to(room).emit('list_participants_in_room', { participants_List: List_of_rooms[room] });
        }
    }
}

function sendWhiteboardToUser(room, socket) {
    if (room && RoomWhiteboards[room]) {
        socket.emit('whiteboard_update', { board: RoomWhiteboards[room] });
    }
}

function handleWhiteboardRequest(room, socket) {
    sendWhiteboardToUser(room, socket);
    return RoomWhiteboards[room] || null;
}

function handleWhiteboardUpdate(room, socket, board, io) {
    if (!room || !board) return;

    RoomWhiteboards[room] = board;
    io.to(room).emit('whiteboard_update', { board });
}

module.exports = {
    joinRoom,
    leaveRoom,
    sendMessageToRoom,
    handleTimerAction,
    changeUserStatus,
    handleWhiteboardRequest,
    handleWhiteboardUpdate
};

