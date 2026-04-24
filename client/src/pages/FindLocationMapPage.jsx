import { useState } from 'react'
import { SelectPlaceOnMap } from '../components/SelectPlaceOnMap';
import { } from '../script/socketConection';

export default function FindLocationMapPage() {


  return (
    <div className="FindLocationMapPage">
      <SelectPlaceOnMap/>
    </div>
  )

}