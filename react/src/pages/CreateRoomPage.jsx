import { useState } from 'react'
import { Sidebar } from '../components/Sidebar';
import CreateRoomSettings from '../components/CreateRoomSpecifics';
import { SelectPlaceOnMap } from '../components/SelectPlaceOnMap';

export default function CreateRoomPage() {


  return (
    <div className="CreateRoomPage">
      <Sidebar />
      <CreateRoomSettings/>
      <SelectPlaceOnMap/>
    </div>
  )

}
