import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import VirtualRoom from './pages/VirtualRoom';

function DashboardPage() {
  return (
    <div style={{ padding: '50px', textAlign: 'center' }}>
      <h1>Welcome to the Secret Dashboard!</h1>
      <p>You have successfully logged in.</p>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* When the URL is "/", show the Home Page */}
        <Route path="/" element={<HomePage />} />
        
        {/* When the URL is "/login", show the Login Page */}
        <Route path="/login" element={<LoginPage />} />
        
        {/* When the URL is "/dashboard", show the Dashboard Page */}
        <Route path="/dashboard" element={<DashboardPage />} />

        <Route path="/virtual-room" element={<VirtualRoom />} />
      </Routes>
    </BrowserRouter>
  );
}
