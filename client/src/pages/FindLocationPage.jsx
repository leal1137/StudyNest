import { useState } from 'react';
import { Sidebar } from '../components/Sidebar';
import UserDisplay from '../components/UserDisplay';
import { useLocation } from 'react-router-dom';
import { useEffect } from 'react';

export default function FindLocationPage() {
  const [location, setLocation] = useState('');
  const routerLocation = useLocation();

  useEffect(() => {
    if (routerLocation.state?.locationName) {
      setLocation(routerLocation.state.locationName);
    }
  }, [routerLocation.state]);

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
          <h2>Locations near</h2>
            <div className="Location-display">
            {location || "No location selected"}
            </div>
        </form>
      </main>
    </div>
  );
}