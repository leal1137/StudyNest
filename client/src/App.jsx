import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import HomePage from './pages/HomePage';
import CreateRoomPage from './pages/CreateRoomPage';
import VirtualRoom from './pages/VirtualRoom';
import SignUpPage from './pages/SignUpPage';
import JoinVirtualRoomPage from './pages/JoinVirtualRoomPage';
import { useEffect } from "react";
import { connect } from './script/socketConection';
import ProtectedRoute from "./components/ProtectedRoute";


export default function App() {

  useEffect(() => {
    connect(); }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/sign-up" element={<SignUpPage />} />
        <Route path="/joinvirtualroom" element={<JoinVirtualRoomPage/>} />
        <Route path="/virtual-room" element={<VirtualRoom />} />

        <Route
          path="/home"
          element={
            <ProtectedRoute>
              <HomePage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/createroom"
          element={
            <ProtectedRoute>
              <CreateRoomPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/virtual-room"
          element={
            <ProtectedRoute>
              <VirtualRoom />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
