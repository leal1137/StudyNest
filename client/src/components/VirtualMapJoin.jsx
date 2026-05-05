import { useState } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import map from '../assets/ai_map.png'
import L from 'leaflet';

import icon from 'leaflet/dist/images/marker-icon.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    iconAnchor: [12, 41]
});

function MapClickHandler({ setPinPosition }) {
  useMapEvents({
    click(e) {
      
    },
  });
  return null;
}

export function VirtualMapJoin() {

  return (
    <div className="map-component">
      <MapContainer className='map-image'
       
      >
        <img src={map} alt="map" className="virtualmap-img" />
       
        <MapClickHandler/>
      </MapContainer>
    </div>
  );
}