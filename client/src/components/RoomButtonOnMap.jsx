import { useState } from 'react';
import '../CSSfiles/JoinRoomPage.css'
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { joinVirtualRoom } from '../script/joinRoom';

export default function RoomButton({id, name, subject, size, x, y, inRoom}) {
    
    const handlejoin = (e) => {
        
        alert(`Joining ${name}`);

        const navigate = useNavigate();
        // Listen for the server's reply
        useEffect(() => {
            if (!socket) return;

            const handleRoomJoined = (data) => {
            // The server confirmed we joined, change the page!
            navigate(`/room/${data.room}`); 
            };

            socket.on('joined_room', handleRoomJoined);

            return () => {
            socket.off('joined_room', handleRoomJoined);
            };
        }, [socket, navigate]);


        // When the button is clicked, call your script!
        const handleJoinClick = (id) => {
            // 2. Use your function from joinRoom.js instead of emitting directly here
            joinVirtualRoom(socket, id); 
        }
        return (
            <button onClick={() => handleJoinClick("Math Study Group")}>
                Join Math Group
            </button>
        );
    };

  

    return (
            <button className='room-button-on-map'  onClick={handlejoin}>
            <span className="room-name">{name}</span>
            <span className="room-stats">{inRoom}/{size}</span>
            <span className="room-subject">{subject}</span>
            </button>
    )

}