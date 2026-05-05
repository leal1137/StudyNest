import { useState } from 'react'
import { Sidebar } from '../components/Sidebar';
import CreateRoomSettings from '../components/CreateRoomSpecifics';
import VirtualMapCreate from '../components/VirtualMapCreate';
import { } from '../script/socketConection';

export default function CreateRoomPage() {


  return (
    <div className="CreateRoomPage">
      <Sidebar />
      <CreateRoomSettings/>
      <VirtualMapCreate/>
    </div>
  )
}
