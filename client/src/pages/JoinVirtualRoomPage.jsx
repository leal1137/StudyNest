import '../cssfiles/JoinRoomPage.css'
import SidebarListofRooms from '../components/SidebarListofRooms';
import { VirtualMapJoin } from '../components/VirtualMapJoin';
import { useState } from 'react';
export default function JoinVirtualRoom() {

    const [rooms, setRooms] = useState([
        { id: 1, name: "Ekonomikum", subject: "Economics", size: 50, x: 200.8594, y: 700.6200 },
        { id: 2, name: "Ångström", subject: "Math", size: 50, x: 500.8397, y: 200.6468 },
        { id: 3, name: "Carolina Rediviva", subject: "English", size: 50, x: 600.8550, y: 700.6310 }
    ]);

    return (

        <div className="JoinVirtualRoom">
            <SidebarListofRooms rooms={rooms} />
            <VirtualMapJoin rooms={rooms}/>
            </div>
    )   
}
