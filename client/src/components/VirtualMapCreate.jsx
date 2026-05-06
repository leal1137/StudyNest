import { useState } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents, Popup, ImageOverlay, CircleMarker } from 'react-leaflet';
import { useNavigate } from 'react-router-dom';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';


import icon from 'leaflet/dist/images/marker-icon.png';
import map from '../assets/fortnite.webp';

let DefaultIcon = L.icon({
  iconUrl: icon,
  iconSize: [25, 41],
  iconAnchor: [12, 41]
});

const locations = [
  { id: 1, name: "Ekonomikum", x: 59.8594, y: 17.6200 },
  { id: 2, name: "Ångström", x: 59.8397, y: 17.6468 },
  { id: 3, name: "Carolina Rediviva", x: 59.8550, y: 17.6310 }
];

L.Marker.prototype.options.icon = DefaultIcon;


function MapClickHandler({ setPinPosition }) {
  useMapEvents({
    click(e) {
      setPinPosition({
        x: e.latlng.lng,
        y: e.latlng.lat
      });
    },
  });
  return null;
}
const bounds = [[0, 0], [825, 1000]];

export default function VirtualMapCreate({pinPosition, setPinPosition}) {
  const [hoveredId, setHoveredId] = useState(null);
  const navigate = useNavigate();

  const handleMarkerClick = (loc) => {
    navigate('/find-location', { state: { locationName: loc.name } });
  };

  return (
    <div className="map-component">
      <MapContainer className='map-image'

        crs={L.CRS.Simple}
        bounds={bounds}

        dragging={false}
        scrollWheelZoom={false}
        doubleClickZoom={false}
        zoomControl={false}
      >
        <ImageOverlay
          url={map}
          bounds={bounds}
        />

        {pinPosition && (
          <Marker position={[pinPosition.y, pinPosition.x]} />
        )}
        <MapClickHandler setPinPosition={setPinPosition} />
      </MapContainer>


    </div>
  );
}


