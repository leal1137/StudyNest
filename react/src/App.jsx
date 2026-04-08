import { BrowserRouter, Routes, Route } from 'react-router-dom';
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
        {/* When the URL is "/", show the Login Page */}
        <Route path="/" element={<LoginPage />} />
        
        {/* When the URL is "/dashboard", show the Dashboard Page */}
        <Route path="/dashboard" element={<DashboardPage />} />
      </Routes>
    </BrowserRouter>
  );
}