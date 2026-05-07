import { useState, useEffect } from 'react';
import '../CSSfiles/JoinRoomPage.css';
import SidebarListofRooms from '../components/SidebarListofRooms';
import { VirtualMapJoin } from '../components/VirtualMapJoin';
import {Sidebar} from '../components/Sidebar';

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
            <div style={{ position: 'absolute', top: '0', left: '0', zIndex: 9999 }}>
                <Sidebar />
            </div>
            <SidebarListofRooms rooms={rooms} />
            <VirtualMapJoin rooms={rooms} />
        </div>
    );
}