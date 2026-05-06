import { useState } from 'react';
import { Sidebar } from '../components/Sidebar';
import UserDisplay from '../components/UserDisplay';
import { useLocation } from 'react-router-dom';
import { useEffect } from 'react';

export default function FindLocationPage() {
  const [location, setLocation] = useState('');
  const [rooms, setRooms]       = useState([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState(null);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const routerLocation = useLocation();

  useEffect(() => {
    if (routerLocation.state?.locationName) {
      setLocation(routerLocation.state.locationName);
    }
  }, [routerLocation.state]);

//fetch rooms from backend
  useEffect(() =>  {
    async function fetchRooms() {
      try {
        const res = await fetch('/api/rooms');
        if (!res.ok) throw new Error('Failed to fetch rooms');
        const data = await res.json();
        setRooms(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchRooms();
  }, []);

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
                  onClick={() => setSelectedRoom(room)}
                >
                  <h3>{room.name}</h3>
                  <h4>People count:</h4>
                  <p>{room.is_silent ? 'Silent room' : 'Group room'}</p>
                  <p>Capacity: {room.max_capacity}</p>
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