import { useState } from 'react'
import { Sidebar } from '../components/Sidebar';
import '../cssfiles/JoinRoomPage.css'
import SidebarListofRooms from '../components/SidebarListofRooms';
import { VirtualMapJoin } from '../components/VirtualMapJoin';
export default function JoinVirtualRoom() {

    const [rooms, setRooms] = useState([
        { id: 1, name: "Ekonomikum", lat: 59.8594, lng: 17.6200 },
        { id: 2, name: "Ångström", lat: 59.8397, lng: 17.6468 },
        { id: 3, name: "Carolina Rediviva", lat: 59.8550, lng: 17.6310 }
    ]);

    return (

        <div className="JoinVirtualRoom">

            
            <SidebarListofRooms rooms={rooms} />
            <VirtualMapJoin rooms={rooms}/>
            </div>
    )   
}
