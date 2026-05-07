import { useState } from 'react';
import { Sidebar } from '../components/Sidebar';
import UserDisplay from '../components/UserDisplay';
import { useLocation } from 'react-router-dom';
import { useEffect } from 'react';

//let inRoom = false;

export default function FindLocationPage({ socket }) {
  const [location, setLocation] = useState('');
  const [ready, setReady] = useState(false);
  const [socketReady, setSocketReady] = useState(false);
  const [rooms, setRooms]       = useState([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState(null);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const routerLocation = useLocation();

  function selectRoom(room) {
    if (!selectedRoom){
      socket.emit('join_physical_room', room.name, null, location);
    }else{
      socket.emit('join_physical_room', room.name, selectedRoom.name, location);

    }
    if(selectedRoom && room.name === selectedRoom.name){
      setSelectedRoom(null);
    }else{
      setSelectedRoom(room);
    }
  }

  useEffect(() => {
    if (routerLocation.state?.locationName) {
      setLocation(routerLocation.state.locationName);
      setReady(true);
    }
  }, [routerLocation.state]);

//fetch rooms from backend
  useEffect(() =>  {
    console.log("SOCKET IN LOCATIONPAGE:", socket ? socket.id : 'null');
    const uppdateRooms = (updatedRooms) => {
      setRooms(updatedRooms);
      setLoading(false);
    }
    const handleError = (err) => {
      setError(err.message);
      setLoading(false);
      console.error('Error fetching rooms:', err.details);
    }
    socket?.on('update_persistent_rooms', uppdateRooms);
    socket?.on('error', handleError);

    if(ready){
      socket?.emit('get_persistent_rooms', location);
    }
    return () => {
      socket?.off('update_persistent_rooms', uppdateRooms);
      socket?.off('error', handleError);
    }
  }, [socket, ready]);

  return (
    <div className="FindLocationPage">
      <Sidebar />
      <UserDisplay />
      <main className="main-content">
        <div className="Location-search-box">
          <h2>Locations near</h2>
          <div className="Location-display">
            {location || 'No location selected'}
          </div>

          {loading && <p>Loading rooms…</p>}
          {error   && <p style={{ color: 'red' }}>Error: {error}</p>}
          {!loading && !error && (
            <div className="rooms-grid">
              {rooms.map((room) => (
                <div
                  key={room.id}
                  className={`room-card ${selectedRoom?.id === room.id ? 'active' : ''}`}
                  onClick={() => selectRoom(room)}
                >
                  <h3>{room.name}</h3>
                  <h4>People count: {room.user_count}</h4>
                </div>
                
              ))}
              <div className="selection-text">
                {selectedRoom
                  ? `You are sitting in: ${selectedRoom.name}`
                  : 'Where are you sitting?'}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
