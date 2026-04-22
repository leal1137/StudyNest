import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import HomePage from './pages/HomePage';
import CreateRoomPage from './pages/CreateRoomPage';
import VirtualRoom from './pages/VirtualRoom';
import SignUpPage from './pages/SignUpPage';
import { useEffect } from "react";
import { connect } from './script/socketConection';
import ProtectedRoute from "./components/ProtectedRoute";
import FindLocationPage from './pages/FindLocationPage';

function DashboardPage() {
  return (
    <div style={{ padding: '50px', textAlign: 'center' }}>
      <h1>Welcome to the Secret Dashboard!</h1>
      <p>You have successfully logged in.</p>
    </div>
  );
}

export default function App() {

  useEffect(() => {
    connect(); }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/sign-up" element={<SignUpPage />} />
        <Route path="/find-location" element={<FindLocationPage />} />
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
