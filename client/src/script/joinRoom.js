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

// import { useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { joinVirtualRoom } from '../script/joinRoom'; // 1. Import your function

// export default function RoomList({ socket }) {
//   const navigate = useNavigate();

//   // Listen for the server's reply
//   useEffect(() => {
//     if (!socket) return;

//     const handleRoomJoined = (data) => {
//       // The server confirmed we joined, change the page!
//       navigate(`/room/${data.room}`); 
//     };

//     socket.on('joined_room', handleRoomJoined);

//     return () => {
//       socket.off('joined_room', handleRoomJoined);
//     };
//   }, [socket, navigate]);


//   // When the button is clicked, call your script!
//   const handleJoinClick = (roomName) => {
//       // 2. Use your function from joinRoom.js instead of emitting directly here
//       joinVirtualRoom(socket, roomName); 
//   }

//   return (
//       <button onClick={() => handleJoinClick("Math Study Group")}>
//           Join Math Group
//       </button>
//   );
// }