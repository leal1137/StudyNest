import { useState } from 'react';
import { Sidebar } from '../components/Sidebar';
import UserDisplay from '../components/UserDisplay';

export default function FindLocationPage() {
  const [location, setLocation] = useState('');

  const searchLocation = (e) => {
    e.preventDefault();
    alert("Searching for: " + location);
  };

  return (
    <div className="FindLocationPage">
      <Sidebar />
      <UserDisplay />
      <main className="main-content">
        <form className="Location-search-box" onSubmit={searchLocation}>
          <h2>Find locations near me</h2>

          <div className="Location-input-group">
            <input
              id="location"
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
          </div>
        </form>
      </main>
    </div>
  );
}