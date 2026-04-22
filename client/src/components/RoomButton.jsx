import { useState } from 'react';
import '../CSSfiles/JoinRoomPage.css'
export default function RoomButton({key, name, subject, size, lat, lng, inRoom}) {
    
    const handlejoin = (e) => {
        e.preventDefault();
        alert(`Joining ${name}`);
    };

    return (
            <button className='room-button'  onClick={handlejoin}>
            <span className="room-name">{name}</span>
            <span className="room-stats">{inRoom}/{size}</span>
            <span className="room-subject">{subject}</span>
            </button>
    )

}