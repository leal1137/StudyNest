import { useState, useEffect } from 'react';
import '../CSSfiles/JoinRoomPage.css';
import SidebarListofRooms from '../components/SidebarListofRooms';
import { VirtualMapJoin } from '../components/VirtualMapJoin';

export default function JoinVirtualRoom() {
    const [rooms, setRooms] = useState([]);

    useEffect(() => {
        // Hämtar arrayen från servern
        fetch('/api/rooms')
            .then(res => res.json())
            .then(data => setRooms(data))
            .catch(err => console.error("Kunde inte hämta rum:", err));
    }, []);

    return (
        <div className="JoinVirtualRoom">
            <SidebarListofRooms rooms={rooms} />
            <VirtualMapJoin rooms={rooms} />
        </div>
    );
}