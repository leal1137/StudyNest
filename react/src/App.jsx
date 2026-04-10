import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';

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
          <Route path="/" element={<LoginPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/createroom" element={<CreateRoomPage />} />

      </Routes>
    </BrowserRouter>
  );
}