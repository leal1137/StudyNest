
/**
 * Anropar servern för att gå med i ett rum.
 * @function joinVirtualRoom
 * @param {string} room 
 * @param {Socket} socket 
 * @returns {void}
 * @description Anropar servern för att gå med i ett rum. 
 * Rummet skapas om det inte redan finns.
 */
export function joinVirtualRoom(room, socket) {
    if (room && socket) {
        socket.emit('join_room', room);
    }
}


export function leaveVirtualRoom(room, socket) {
    if (room && socket) {
        socket.emit('leave_room', room);
    }
}
