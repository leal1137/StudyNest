import { useState, useEffect } from 'react';
import '../CSSfiles/JoinRoomPage.css';
import SidebarListofRooms from '../components/SidebarListofRooms';
import { VirtualMapJoin } from '../components/VirtualMapJoin';
import {Sidebar} from '../components/Sidebar';

export default function JoinVirtualRoom({ socket }) {
    const [rooms, setRooms] = useState([]);

    useEffect(() => {
        // Hämtar arrayen från servern
        fetch('/api/virtual-rooms')
            .then(res => res.json())
            .then(data => setRooms(data))
            .catch(err => console.error("Kunde inte hämta rum:", err));
    }, []);

    useEffect(() => {
        if (!socket) return undefined;

        const handleRoomCountsUpdated = (roomCounts) => {
            setRooms((currentRooms) =>
                currentRooms.map((room) => ({
                    ...room,
                    inRoom: roomCounts[room.name] || 0
                }))
            );
        };

        socket.on('room_counts_updated', handleRoomCountsUpdated);
        socket.emit('get_room_counts');

        return () => {
            socket.off('room_counts_updated', handleRoomCountsUpdated);
        };
    }, [socket]);

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
