import { useState } from 'react';
import { MapContainer, TileLayer, CircleMarker } from 'react-leaflet';
import { useMapEvents } from 'react-leaflet';
import { useNavigate } from 'react-router-dom';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

import icon from 'leaflet/dist/images/marker-icon.png';
import map from '../assets/ai_map.png';

let DefaultIcon = L.icon({
  iconUrl: icon,
  iconSize: [25, 41],
  iconAnchor: [12, 41]
});

const locations = [
  { id: 1, name: "Ekonomikum", lat: 59.8594, lng: 17.6200 },
  { id: 2, name: "Ångström", lat: 59.8397, lng: 17.6468 },
  { id: 3, name: "Carolina Rediviva", lat: 59.8550, lng: 17.6310 }
];

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

export default function VirtualMapCreate() {
  const [hoveredId, setHoveredId] = useState(null);
  const navigate = useNavigate();

  const handleMarkerClick = (loc) => {
    navigate('/find-location', { state: { locationName: loc.name } });
  };

  return (
    <div className="map-component">
      <MapContainer className='map-image'
    >
       
      <img src={map} alt="map" className="virtualmap-img" />

      {locations.map((loc) => (
        <CircleMarker
          key={loc.id}
          center={[loc.lat, loc.lng]}
          radius={10}
          pathOptions={{
            color: 'blue',
            fillColor: hoveredId === loc.id ? 'white' : 'blue',
            fillOpacity: 1
          }}
          eventHandlers={{
            click: () => handleMarkerClick(loc),
            mouseover: () => setHoveredId(loc.id),
            mouseout: () => setHoveredId(null)
          }}
        />
      ))}

      </MapContainer>
    </div>
  );
}

// <Marker position={[pinPosition.lat, pinPosition.lng]} />
//<MapClickHandler setPinPosition={setPinPosition} />
