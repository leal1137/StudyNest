import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import CreateRoomPage from './pages/CreateRoomPage';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/createroom" element={<CreateRoomPage />} />

      </Routes>
    </BrowserRouter>
  );
}