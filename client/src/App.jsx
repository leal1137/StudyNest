import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import HomePage from './pages/HomePage';
import CreateRoomPage from './pages/CreateRoomPage';
import VirtualRoom from './pages/VirtualRoom';
import SignUpPage from './pages/SignUpPage';
import { useEffect,useState } from "react";
import { connect } from './script/socketConection';
import ProtectedRoute from "./components/ProtectedRoute";
import FindLocationPage from './pages/FindLocationPage';
import FindLocationPageMap from './pages/FindLocationMapPage';

function DashboardPage() {
  return (
    <div style={{ padding: '50px', textAlign: 'center' }}>
      <h1>Welcome to the Secret Dashboard!</h1>
      <p>You have successfully logged in.</p>
    </div>
  );
}

export default function App() {
  const [socket, setSocket] = useState(null);
  useEffect(() => {
    const soc = connect();
    
    if (!soc) return;

    const handleConnect = () => {
      console.log("SOCKET IN APP:", soc ? soc.id : 'null');
      setSocket(soc);
    }
    soc.on('connect', handleConnect);
    // return () => { //test for connect first time
    //   soc.off('connect', handleConnect);
    // };
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage/>} />
        <Route path="/sign-up" element={<SignUpPage />} />
        <Route path="/find-location" element={<FindLocationPage />} />
        <Route path="/virtual-room" element={<VirtualRoom />} />
        <Route path="/find-location-map" element={<FindLocationPageMap />} />


        <Route
          path="/home"
          element={
            <ProtectedRoute>
              <HomePage socket={socket} />
            </ProtectedRoute>
          }
        />

        <Route
          path="/createroom"
          element={
            <ProtectedRoute>
              <CreateRoomPage socket={socket}/>
            </ProtectedRoute>
          }
        />

        <Route
          path="/virtual-room"
          element={
            <ProtectedRoute>
              <VirtualRoom socket={socket}/>
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
