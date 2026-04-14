import { useState } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

import icon from 'leaflet/dist/images/marker-icon.png';

let DefaultIcon = L.icon({
  iconUrl: icon,
  iconSize: [25, 41],
  iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

function MapClickHandler({ setPinPosition }) {
  useMapEvents({
    click(e) {
      setPinPosition({
        lat: e.latlng.lat,
        lng: e.latlng.lng
      });
    },
  });
  return null; 
}

export function SelectPlaceOnMap() {
  const [pinPosition, setPinPosition] = useState({ lat: 59.8586, lng: 17.6389 });

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
        
        <MapClickHandler setPinPosition={setPinPosition} />
        <Marker position={[pinPosition.lat, pinPosition.lng]} />
      </MapContainer>
    </div>
  );
}