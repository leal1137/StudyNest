import { useState } from 'react'
import { Sidebar } from '../components/Sidebar';
import '../cssfiles/JoinRoomPage.css'
import SidebarListofRooms from '../components/SidebarListofRooms';
import { MapWithRoomsOn } from '../components/MapWithRoomsOn'; 
export default function JoinVirtualRoom() {


    return (

        <div className="JoinVirtualRoom">
            <SidebarListofRooms />
            <MapWithRoomsOn/>
            </div>
    )
}
