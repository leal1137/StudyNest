// StudyNest2/client/src/script/joinRoom.js
export function joinVirtualRoom(socket, roomName) {
  console.log(`Attempting to join room: ${roomName}`);

  socket.emit('join_room', roomName);

  //Move this to the front end component
  socket.on('joined_room', (data) => {
      console.log("Successfully joined!", data);
      // Redirect to the virtual room page or update state
  });
}