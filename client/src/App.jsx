import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import HomePage from './pages/HomePage';
import CreateRoomPage from './pages/CreateRoomPage';
import VirtualRoom from './pages/VirtualRoom';
import SignUpPage from './pages/SignUpPage';
import JoinVirtualRoomPage from './pages/JoinVirtualRoomPage';
import { useEffect,useState } from "react";
import { connect } from './script/socketConection';
import ProtectedRoute from "./components/ProtectedRoute";
import FindLocationPage from './pages/FindLocationPage';
import FindLocationPageMap from './pages/FindLocationMapPage';


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
        <Route 
          path="/" 
          element={
            <LoginPage 
              socket={socket} 
              setSocket={setSocket} 
            />
          } 
        />
        <Route 
          path="/sign-up" 
          element={
          <SignUpPage 
          />
          }
        />
        <Route 
          path="/find-location" 
          element={
            <ProtectedRoute>
              <FindLocationPage 
              />
            </ProtectedRoute>
          }
        />
        <Route 
          path="/find-location-map" 
          element={
            <ProtectedRoute>
              <FindLocationPageMap />
            </ProtectedRoute>
          }
        />

        <Route
          path="/home"
          element={
            <ProtectedRoute>
              <HomePage 
                socket={socket} 
                setSocket={setSocket} 
              />
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
