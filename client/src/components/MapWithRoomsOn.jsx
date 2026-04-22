import { useState } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

import icon from 'leaflet/dist/images/marker-icon.png';


function MapClickHandler({ setPinPosition }) {
  useMapEvents({
    click(e) {
      
    },
  });
  return null;
}

export function MapWithRoomsOn() {

  return (
    <div className="map-component">
      <MapContainer className='map-image'
        center={[59.8586, 17.6389]}
        zoom={13}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <MapClickHandler/>
      </MapContainer>
    </div>
  );
}