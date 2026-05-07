import { useState } from 'react';
import { MapContainer, TileLayer, Marker, Tooltip, ImageOverlay } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import RoomButton from './RoomButtonOnMap';
import map from '../assets/fortnite.webp';
import L from 'leaflet';

const bounds = [[0, 0], [825, 1000]];

const transparentIcon = new L.DivIcon({
  className: 'transparent-icon',
  html: '<div></div>'
});

export function VirtualMapJoin({ rooms }) {
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

        {rooms && rooms.map((room) => (
          <Marker
            key={room.id}
            position={[room.y, room.x]}
            icon={transparentIcon}
          >
            <Tooltip permanent direction="center" className="custom-map-tooltip">
              <RoomButton
                id={room.id}
                name={room.name}
                subject={room.subject}
                inRoom={room.inRoom}
                size={room.size}
                isPrivate={room.isPrivate}
                chatEnabled={room.chatEnabled}
                voiceEnabled={room.voiceEnabled}
                whiteboardEnabled={room.whiteboardEnabled}
              />
            </Tooltip>
          </Marker>
        ))}

      </MapContainer>
    </div>
  );
}
