import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import CreateRoomPage from './pages/CreateRoomPage';
import VirtualRoom from './pages/VirtualRoom';
import SignUpPage from './pages/SignUpPage';
import JoinVirtualRoomPage from './pages/JoinVirtualRoomPage';


export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/createroom" element={<CreateRoomPage />} />
        <Route path="/sign-up" element={<SignUpPage />} />
        <Route path="/joinvirtualroom" element={<JoinVirtualRoomPage/>} />
        <Route path="/virtual-room" element={<VirtualRoom />} />
      </Routes>
    </BrowserRouter>
  );
}
