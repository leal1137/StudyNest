import { useState } from 'react'
import { Sidebar } from '../components/Sidebar';
import CreateRoomSettings from '../components/CreateRoomSpecifics';
import { SelectPlaceOnMap } from '../components/SelectPlaceOnMap';
import { } from '../script/socketConection';

export default function CreateRoomPage() {


  return (
    <div className="CreateRoomPage">
      <Sidebar />
      <CreateRoomSettings/>
      <FakeMapCreateRoom/>
    </div>
  )

}
