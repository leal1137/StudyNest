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
  const routerLocation = useLocation();

  useEffect(() => {
    if (routerLocation.state?.locationName) {
      setLocation(routerLocation.state.locationName);
    }
  }, [routerLocation.state]);

//fetch rooms from backend
  userEffect(() =>  {
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
            <ul>
              {rooms.map((room) => (
                <li key={room.id}>
                  <strong>{room.name}</strong>
                  {room.is_silent ? ' (silent)' : ''} — capacity {room.max_capacity}
                </li>
              ))}
            </ul>
          )}
        </div>
      </main>
    </div>
  );
}