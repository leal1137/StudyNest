import { useState } from 'react'
import { Sidebar } from '../components/Sidebar';
import CreateRoomSettings from '../components/CreateRoomSpecifics';
import VirtualMapCreate from '../components/VirtualMapCreate';
import { } from '../script/socketConection';
import '../cssfiles/JoinRoomPage.css'


export default function CreateRoomPage() {

  const [pinPosition, setPinPosition] = useState(null);

  return (
    <div className="CreateRoomPage">
      <Sidebar />
      <CreateRoomSettings pinPosition={pinPosition}/>
      <VirtualMapCreate pinPosition={pinPosition} setPinPosition={setPinPosition} />
    </div>
  )
}
