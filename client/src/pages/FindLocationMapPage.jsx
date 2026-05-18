import { useState } from 'react'
import { SelectPlaceOnMap } from '../components/SelectPlaceOnMap';
import { } from '../script/socketConection';
import { Sidebar } from '../components/Sidebar';

export default function FindLocationMapPage() {


  return (
    <div className="FindLocationMapPage">
      <div style={{ position:'absolute', top:'0', left:'0', zIndex:9999}}>
      <Sidebar/>
      </div>
      <SelectPlaceOnMap/>
    </div>
  )

}