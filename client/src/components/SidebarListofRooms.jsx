import { useState } from 'react';
import { Sidebar } from '../components/Sidebar';
import RoomButton from './RoomButton';
export default function SidebarListofRooms() {
    const [rooms, setRooms] = useState([
        {id: "room-1", name: "Test", subject: "Everything", size: 30, lat: 59.3141, lng: 30.41},
        {id: "room-2", name: "TestTest", subject: "Everything", size: 20, lat: 59.3142, lng: 30.41}
    ]);


    return (


        
       <Sidebar>
        <RoomButton
                
        />
       </Sidebar>
    )
}